sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller) {
        "use strict";

        return Controller.extend("protech.Empleados.controller.VerEmpleados", {
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "mostrarDetalles", this.mostrarDetallesEmpleado, this);
            },

            mostrarDetallesEmpleado: function (category, nameEvent, path) {
                var vistaDetalles = this.byId("vistaDetallesEmpleado");
                vistaDetalles.bindElement("employeesModel>" + path);
            }

        });

    });