sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            var oView = this.getView();

            var oJSONModelEmpl = new sap.ui.model.json.JSONModel;
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCountries = new sap.ui.model.json.JSONModel;
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false,
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");
        }

        function onFilter() {
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();

            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        }

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");

            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        }

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");

            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }

        function showOrders(oEvent) {
            // Get selected controller.
            var iconPressed = oEvent.getSource();

            // Context from the model.
            var oContext = iconPressed.getBindingContext("jsonEmployees");
            
            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };

            // Dialog binding to the Context to have access to the data of selected item.
            this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
            this._oDialogOrders.open();

            // var ordersTable = this.getView().byId("ordersTable");
            // ordersTable.destroyItems();

            // var itemPressed = oEvent.getSource();
            // var oContext = itemPressed.getBindingContext("jsonEmployees");
            // var objectContext = oContext.getObject();
            // var orders = objectContext.Orders;
            // var ordersItems = [];

            // for ( var i in orders ) {
            //     ordersItems.push(new sap.m.ColumnListItem({
            //         cells: [
            //             new sap.m.Label({ text: orders[i].OrderID }),
            //             new sap.m.Label({ text: orders[i].Freight }),
            //             new sap.m.Label({ text: orders[i].ShipAddress })
            //         ]
            //     }));
            // }

            // var newTable = new sap.m.Table({
            //     width: "auto",
            //     columns: [
            //         new sap.m.Column({header: new sap.m.Label({text: "{i18n>orderID}"})}),
            //         new sap.m.Column({header: new sap.m.Label({text: "{i18n>freight}"})}),
            //         new sap.m.Column({header: new sap.m.Label({text: "{i18n>shipAddress}"})})
            //     ],
            //     items: ordersItems
            // }).addStyleClass("sapUiSmallMargin");

            // ordersTable.addItem(newTable);

            // // Crear tabla y agregar propiedades.
            // var newTableJSON = new sap.m.Table();
            // newTableJSON.setWidth("auto");
            // newTableJSON.addStyleClass("sapUiSmallMargin");

            // // Agregar columna OrderID.
            // var columnOrderID = new sap.m.Column();
            // var labelOrderID  = new sap.m.Label();
            // labelOrderID.bindProperty("text", "i18n>orderID");
            // columnOrderID.setHeader(labelOrderID);
            // newTableJSON.addColumn(columnOrderID);

            // // Agregar columna Freight.
            // var columnFreight = new sap.m.Column();
            // var labelFreight  = new sap.m.Label();
            // labelFreight.bindProperty("text", "i18n>freight");
            // columnFreight.setHeader(labelFreight);
            // newTableJSON.addColumn(columnFreight);

            // // Agregar columna Ship Address.
            // var columnShipAddress = new sap.m.Column();
            // var labelShipAddress  = new sap.m.Label();
            // labelShipAddress.bindProperty("text", "i18n>shipAddress");
            // columnShipAddress.setHeader(labelShipAddress);
            // newTableJSON.addColumn(columnShipAddress);

            // // Crear columnListItem.
            // var columnListItem = new sap.m.ColumnListItem();

            // // Agregar celda OrderID.
            // var cellOrderID = new sap.m.Label();
            // cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            // columnListItem.addCell(cellOrderID);

            // // Agregar celda Freight.
            // var cellFreight = new sap.m.Label();
            // cellFreight.bindProperty("text", "jsonEmployees>Freight");
            // columnListItem.addCell(cellFreight);

            // // Agregar celda Ship Address.
            // var cellShipAddress = new sap.m.Label();
            // cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            // columnListItem.addCell(cellShipAddress);

            // // Agregar Binding a la tabla.
            // var oBindingInfo = {
            //     model: "jsonEmployees",
            //     path: "Orders",
            //     template: columnListItem
            // };

            // newTableJSON.bindAggregation("items", oBindingInfo);
            // newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

            // // Agregar tabla al HBOX.
            // ordersTable.addItem(newTableJSON);
        }

        function onCloseOrders () {
            this._oDialogOrders.close();
        }

        var Main = Controller.extend("logaligroup.Employees.controller.MainView", {});

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;

        return Main;

    });