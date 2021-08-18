sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "protech/Empleados/model/Formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, Formatter, Filter, FilterOperator, MessageToast, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("protech.Empleados.controller.DetallesEmpleado", {
            Formatter: Formatter,

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "mostrarDetalles", this.navegarHaciaDetalles, this);
                this._bus.subscribe("flexible", "onBack", this.navegarHaciaInicial, this);

                // Agregar modelo JSON para el dialogo de ascenso.
                this.jsonAscenso = new JSONModel();
                this.jsonAscenso.setData({
                    "Ammount": "",
                    "CreationDate": null,
                    "Comments": ""
                });
                this.getView().setModel(this.jsonAscenso, "jsonAscenso");
            },

            navegarHaciaDetalles: function (category, nameEvent, path) {
                this.byId("detallesNavContainer").to(this.byId("paginaDetalles"));

                var sEmployeeId = this.getView().getModel("employeesModel").getObject(path).EmployeeId;

                this.byId("uploadCollectionDet").bindAggregation("items", {
                    path: "employeesModel>/Attachments",
                    filters: [
                        new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                        new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId) 
                    ],
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{employeesModel>AttId}",
                        visibleEdit: false,
                        fileName: "{employeesModel>DocName}"
                    }).attachPress(this.downloadFile)
                });

                var oTimeline = this.byId("timeline");

                var filter = new Filter({
                        path: "EmployeeId",
                        value1: sEmployeeId,
                        operator: FilterOperator.EQ
                    });

                oTimeline.setModelFilter({
                    type: sap.suite.ui.commons.TimelineFilterType.Data,
                    filter: filter
                });
            },

            navegarHaciaInicial: function (category, nameEvent) {
                this.byId("detallesNavContainer").to(this.byId("paginaInicial"));
            },

            onBeforeUpload: function(oEvent) {
                var sEmployeeId = oEvent.getSource().getBindingContext("employeesModel").getObject().EmployeeId;

                // Header Slug
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + sEmployeeId + ";" + oEvent.getParameter("fileName")
                });

                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		    },
        
          	onChange: function(oEvent) {
                var oUploadCollection = oEvent.getSource();

                // Header Token
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("employeesModel").getSecurityToken()
                });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		    },

            onUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("employeesModel").getPath();
                this.getView().getModel("employeesModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    }
                });
            },

            downloadFile: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext("employeesModel").getPath();
                window.open("sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            },

            onDarDeBaja: function (oEvent) {
                var oI18n = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(oI18n.getText("confirmarBaja"), {
                    onClose: function onCloseConfirm (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            var oI18n = this.getView().getModel("i18n").getResourceBundle();
                            var sPath = this.getView().getBindingContext("employeesModel").getPath();

                            this.getView().getModel("employeesModel").remove(sPath, {
                                success: function () {
                                    MessageToast.show(oI18n.getText("deleteOK"));

                                    this.getView().getModel("employeesModel").refresh();

                                    this.navegarHaciaInicial();
                                }.bind(this),
                                error: function (error) {
                                    MessageToast.show(oI18n.getText("deleteKO"));
                                }
                            });         
                        };
                    }.bind(this)
                });
            },

            onAscender: function() {
                if (!this._dialogoAscenso) {
                    this._dialogoAscenso = sap.ui.xmlfragment("protech.Empleados.fragment.DialogoAscenso", this);
                    this.getView().addDependent(this._dialogoAscenso);
                };

                this._dialogoAscenso.bindElement("jsonAscenso");
                this._dialogoAscenso.open();
            },

            onCancelarAscenso: function () {
                this._dialogoAscenso.close();
                this.jsonAscenso.setProperty("/Ammount", "");
                this.jsonAscenso.setProperty("/CreationDate", null);
                this.jsonAscenso.setProperty("/Comments", "");
            },

            onAceptarAscenso: function () {
                var oI18n = this.getView().getModel("i18n").getResourceBundle();

                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: this.getView().getBindingContext("employeesModel").getObject().EmployeeId,
                    CreationDate: this.jsonAscenso.getProperty("/CreationDate"),
                    Ammount: this.jsonAscenso.getProperty("/Ammount"),
                    Waers: "EUR",
                    Comments: this.jsonAscenso.getProperty("/Comments"),
                };

                this.getView().getModel("employeesModel").create("/Salaries", body, {
                    success: function (oData, response) {
                        sap.m.MessageToast.show(oI18n.getText("ascensoRealizado"));
                        this.getView().getModel("employeesModel").refresh();
                        this.onCancelarAscenso();
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show(oI18n.getText("errorAscenso"));
                    }.bind(this)
                });
            }

        });

    });