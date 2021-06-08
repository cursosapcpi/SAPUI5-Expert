sap.ui.define([
    "sap/ui/core/UIComponent",
    "logaligroup/SAPUI5/model/Models",
    "sap/ui/model/resource/ResourceModel",
    "./controller/HelloDialog",
    "sap/ui/Device"
],
/**
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
 * @param {typeof sap.ui.Device} Device
 */
function(UIComponent, Models, ResourceModel, HelloDialog, Device) {

    return UIComponent.extend("logaligroup.SAPUI5.Component", {

        metadata: {
            manifest : "json"
        },

        init: function() {
            // Call the parent's init function.
            UIComponent.prototype.init.apply(this, arguments);

            // Set data model on the view.
            this.setModel(Models.createRecipient());

            // Set the device Model.
            this.setModel(Models.createDeviceModel(), "device");

            this._helloDialog = new HelloDialog(this.getRootControl());

            // Create the views based on the URL/Hash.
            this.getRouter().initialize();
        },

        exit: function() {
            this._helloDialog.destroy();
            delete this._helloDialog;
        },

        openHelloDialog: function() {
            this._helloDialog.open();
        },

        getContentDensityClass: function() {
            if (!Device.support.touch) {
                this._ContentDensityClass = "sapUiSizeCompact";
            } else {
                this._ContentDensityClass = "sapUiSizeCozy";
            }

            return this._ContentDensityClass;
        }

    });
    
});