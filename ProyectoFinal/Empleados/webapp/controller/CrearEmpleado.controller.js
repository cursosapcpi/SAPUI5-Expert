sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "protech/Empleados/model/Formatter"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, MessageBox, History, UIComponent, JSONModel, MessageToast, Formatter) {
        "use strict";

        return Controller.extend("protech.Empleados.controller.CrearEmpleado", {
            Formatter: Formatter,

            onInit: function () {
                this._wizard = this.byId("wizardEmpleado");
                this._oNavContainer = this.byId("wizardNavContainer");
                
                // Agregar modelo JSON para el Layout.
                this.jsonLayout = new JSONModel();
                this.jsonLayout.setData({
                    "NombreValueState": "None",
                    "ApellidosValueState": "None",
                    "DniValueState": "None",
                    "FechaValueState": "None"
                });
                this.getView().setModel(this.jsonLayout, "jsonLayout");

                // Agregar modelo JSON para los datos del empleado.
                this.jsonEmployee = new JSONModel();
                this.jsonEmployee.setData({
                    "Type": "",
                    "FirstName": "",
                    "LastName": "",
                    "Dni": "",
                    "Amount": 0,
                    "CreationDate": null,
                    "Comments": "",
                    "Attachments": ""
                });
                this.getView().setModel(this.jsonEmployee, "jsonEmployee");
            },

            onCancelar: function (oEvent) {
                let oI18n = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(oI18n.getText("textoConfirmar"), {
                    title: oI18n.getText("tituloConfirmar"),
                    onClose: function onCloseConfirm(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            this._volverAlWizard();
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            this._wizard.invalidateStep(this.byId("primerPaso"));

                            this._inicializarLayoutModel();
                            
                            var oUploadCollection = this.byId("uploadCollection");
                            oUploadCollection.destroyItems();

                            var sPreviousHash = History.getInstance().getPreviousHash();

                            if (sPreviousHash !== undefined) {
                                window.history.go(-1);
                            } else {
                                var oRouter = UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteApp", true);
                            };
                        };
                    }.bind(this)
                });
            },

            onInterno: function (oEvent) {
                if (this.jsonEmployee.getProperty("/Type") !== "") {
                    this.validarDatosForm();
                };
                
                this.jsonEmployee.setProperty("/Type", "0");
                this.jsonEmployee.setProperty("/Amount", 24000);

                this._irAlSegundoPaso();

                this._cargarFragmento("Interno");
            },

            onAutonomo: function (oEvent) {
                if (this.jsonEmployee.getProperty("/Type") !== "") {
                    this.validarDatosForm();
                };

                this.jsonEmployee.setProperty("/Type", "1");
                this.jsonEmployee.setProperty("/Amount", 400);

                this._irAlSegundoPaso();

                this._cargarFragmento("Autonomo");
            },

            onGerente: function (oEvent) {
                if (this.jsonEmployee.getProperty("/Type") !== "") {
                    this.validarDatosForm();
                };

                this.jsonEmployee.setProperty("/Type", "2");
                this.jsonEmployee.setProperty("/Amount", 70000);

                this._irAlSegundoPaso();

                this._cargarFragmento("Gerente");
            },

            _irAlSegundoPaso: function () {
                if (this._wizard.getCurrentStep() === this.byId("primerPaso").sId) {
                    this._wizard.nextStep();
                };
            },

            _cargarFragmento: function (sFragment) {
                var oPanel = this.byId("panelSegundoPaso");
                oPanel.removeAllContent();
                if (this._oFragment !== undefined) {
                    this._oFragment.destroy(true);
                }
                this._oFragment = sap.ui.xmlfragment("protech.Empleados.fragment." + sFragment, this);
                oPanel.addContent(this._oFragment);
            },

            validarDatosForm: function (oEvent) {
                var sNombre = sap.ui.getCore().byId("inputNombre").getValue();
                var sApellidos = sap.ui.getCore().byId("inputApellidos").getValue();
                var sFecha = sap.ui.getCore().byId("inputFecha").getValue();
                var sDni = sap.ui.getCore().byId("inputDni").getValue();

                if (sNombre === "") {
                    this.jsonLayout.setProperty("/NombreValueState", "Error");
                } else {
                    this.jsonLayout.setProperty("/NombreValueState", "None");
                };
                
                if (sApellidos === "") {
                    this.jsonLayout.setProperty("/ApellidosValueState", "Error");
                } else {
                    this.jsonLayout.setProperty("/ApellidosValueState", "None");
                };

                if (sFecha === "") {
                    this.jsonLayout.setProperty("/FechaValueState", "Error");
                } else {
                    this.jsonLayout.setProperty("/FechaValueState", "None");
                };
                
                if (sDni === "") {
                    this.jsonLayout.setProperty("/DniValueState", "Error");
                } else {
                    if (this.jsonEmployee.getProperty("/Type") === "1") {
                        this.jsonLayout.setProperty("/DniValueState", "None");
                    } else {
                        this._validarDNI(sDni);
                    }
                };

                if (this.jsonLayout.getProperty("/NombreValueState") === "Error" ||
                    this.jsonLayout.getProperty("/ApellidosValueState") === "Error" ||
                    this.jsonLayout.getProperty("/DniValueState") === "Error" ||
                    this.jsonLayout.getProperty("/FechaValueState") === "Error") {
                    this._wizard.invalidateStep(this.byId("segundoPaso"));
                } else {
                    this._wizard.validateStep(this.byId("segundoPaso"));
                };
            },

            onWizardCompletado: function () {
                let oUploadCollection = this.byId("uploadCollection");
                let sFicheros = oUploadCollection.getItems().length + " Ficheros";
                this.jsonEmployee.setProperty("/Attachments", sFicheros);

                if (this.byId("segundoPaso").getProperty("validated") === false) {
                    MessageBox.error("Corrija los errores antes de continuar.");
                } else {
                    this._oNavContainer.to(this.byId("paginaResumen"));
                };
            },

            editarPrimerPaso: function () {
                this._irAlPaso(0);
            },

            editarSegundoPaso: function () {
                this._irAlPaso(1);
            },

            editarTercerPaso: function () {
                this._irAlPaso(2);
            },

            _irAlPaso: function (paso) {
                var onAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[paso]);
                    this._oNavContainer.detachAfterNavigate(onAfterNavigate);
                }.bind(this)

                this._oNavContainer.attachAfterNavigate(onAfterNavigate);
                this._volverAlWizard();
            },

            _volverAlWizard: function () {
                this._oNavContainer.backToPage(this.byId("paginaWizard").getId());
            },

            _validarDNI: function (sDni) {
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;

                // Se comprueba que el formato es válido.
                if (regularExp.test (sDni) === true) {
                    // Número.
                    number = sDni.substr(0, sDni.length-1);

                    // Letra.
                    letter = sDni.substr(sDni.length-1,1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number,number+1);

                    if (letterList !== letter.toUpperCase()) {
                        this.jsonLayout.setProperty("/DniValueState", "Error");
                    } else {
                        this.jsonLayout.setProperty("/DniValueState", "None");
                    };
                } else {
                    this.jsonLayout.setProperty("/DniValueState", "Error");
                };
            },

            _inicializarLayoutModel() {
                this.jsonLayout.setProperty("/NombreValueState", "None");
                this.jsonLayout.setProperty("/ApellidosValueState", "None");
                this.jsonLayout.setProperty("/DniValueState", "None");
                this.jsonLayout.setProperty("/FechaValueState", "None");
                this.jsonEmployee.setProperty("/Type", "");
                this.jsonEmployee.setProperty("/FirstName", "");
                this.jsonEmployee.setProperty("/LastName", "");
                this.jsonEmployee.setProperty("/Dni", "");
                this.jsonEmployee.setProperty("/Amount", 0);
                this.jsonEmployee.setProperty("/CreationDate", null);
                this.jsonEmployee.setProperty("/Comments", "");
                this.jsonEmployee.setProperty("/Attachments", "");
            },

            onFilenameLengthExceed: function(oEvent) {
                let oI18n = this.getView().getModel("i18n").getResourceBundle();
                MessageToast.show(oI18n.getText("largoArchivoExcedido"));
            },

            onFileSizeExceed: function(oEvent) {
                let oI18n = this.getView().getModel("i18n").getResourceBundle();
                MessageToast.show(oI18n.getText("tamanoArchivoExcedido"));
            },

            onBeforeUpload: function(oEvent) {
                var objContext = oEvent.getSource().getBindingContext("employeesModel").getObject();

                // Header Slug
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + objContext.EmployeeId + ";" + oEvent.getParameter("fileName")
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

            onGuardar: function () {
                let oI18n = this.getView().getModel("i18n").getResourceBundle();

                var body = {
                    Type: this.jsonEmployee.getProperty("/Type"),
                    SapId: this.getOwnerComponent().SapId,
                    FirstName: this.jsonEmployee.getProperty("/FirstName"),
                    LastName: this.jsonEmployee.getProperty("/LastName"),
                    Dni: this.jsonEmployee.getProperty("/Dni"),
                    CreationDate: this.jsonEmployee.getProperty("/CreationDate"),
                    Comments: this.jsonEmployee.getProperty("/Comments"),
                    UserToSalary: [
                        {
                            Ammount: this.jsonEmployee.getProperty("/Amount").toString(),
                            Comments: this.jsonEmployee.getProperty("/Comments"),
                            Waers: "EUR"
                        }
                    ]
                };

                this.getView().getModel("employeesModel").create("/Users", body, {
                    success: function () {
                        sap.m.MessageToast.show(oI18n.getText("usersGuardadoOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oI18n.getText("usersGuardadoKO"));
                    }.bind(this)
                });

                // var oUploadCollection = this.byId("uploadCollection");
                // var cFiles = oUploadCollection.getItems().length;

                // if (cFiles > 0) {
                //     oUploadCollection.upload();
                // }
            }
        });
    });