sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("protech.Empleados.controller.MenuPrincipal", {
            onInit: function () {

            },

            onAfterRendering: function () {
                // Error en el framework: Al agregar la dirección URL de "Firmar pedidos", el componente GenericTile debería navegar directamente a dicha URL,
                // pero no funciona en la versión 1.78. Por tanto, una solución encontrada es eliminando la propiedad id del componente por jquery
                var genericTileFirmarPedido = this.byId("tileFirmarPedido");
                // Id del dom.
                var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
                // Se vacía el id.
                jQuery("#"+idGenericTileFirmarPedido)[0].id = "";
            },

            toCrearEmpleado: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCrearEmpleado");
            },

            toVerEmpleados: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteVerEmpleados");
            }
        });
    });