sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (Controller, Filter, FilterOperator, History, UIComponent) {
        "use strict";

        return Controller.extend("protech.Empleados.controller.MaestroEmpleados", {
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },

            onBeforeRendering: function () {
                // Agregar filtro por SapId.
                var aFiltros = [];
                var oFiltro = new Filter("SapId", FilterOperator.Contains, this.getOwnerComponent().SapId);
                aFiltros.push(oFiltro);

                var oLista = this.byId("listaEmpleados");
                var oBinding = oLista.getBinding("items");
                oBinding.filter(aFiltros, sap.ui.model.FilterType.Application);
            },

            onSearch: function (oEvent) {
                // Agregar filtro por el valor del SearchField al array.
                var aFiltros = [];
                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    var oFiltro = new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId);
                    aFiltros.push(oFiltro);
                    var oFiltro = new Filter("FirstName", FilterOperator.StartsWith, sQuery);
                    aFiltros.push(oFiltro);
                } else {
                    var oFiltro = new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId);
                    aFiltros.push(oFiltro);
                };

                // Filtrar lista mediante el array.
                var oLista = this.byId("listaEmpleados");
                var oBinding = oLista.getBinding("items");
                oBinding.filter(aFiltros, sap.ui.model.FilterType.Application);
            },

            mostrarDetalles: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext("employeesModel").getPath();
                this._bus.publish("flexible", "mostrarDetalles", sPath);
            },

            onBack: function () {
                this._bus.publish("flexible", "onBack");

                var sPreviousHash = History.getInstance().getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteApp", true);
                };
            }

        });

    });