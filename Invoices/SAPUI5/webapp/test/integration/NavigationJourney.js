sap.ui.define([
    'logaligroup/SAPUI5/localService/mockserver',
    'sap/ui/test/opaQunit',
    './pages/HelloPanel'
],
/**
 * @param {typeof sap.ui.test.opaQunit} opaQunit
 */
function(mockserver, opaQunit) {
    'use strict';
    
    // Initialize Mock Server.
    mockserver.init();

    QUnit.module("Navigation");

    opaQunit("Should open the Hello Dialog", function(Given, When, Then) {
        
        // Arrangements.
        Given.iStartMyUIComponent({
            componentConfig: {
                name: "logaligroup.SAPUI5"
            }
        });

        // Actions.
        When.onTheAppPage.iSayHelloDialogButton();

        // Assertions.
        Then.onTheAppPage.iSeeTheHelloDialog();
        
        // Cleanup.
        Then.iTeardownMyApp();

    });
});