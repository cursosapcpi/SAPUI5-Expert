sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
/**
 * @param {typof sap.ui.core.mvc.Controller} Controller
 */
function (Controller) {
    "use strict";

    return Controller.extend("logaligroup.SAPUI5.controller.App", {

        onInit: function() {

        },

        onOpenDialogHeader: function() {
            this.getOwnerComponent().openHelloDialog();
        }

    });
});