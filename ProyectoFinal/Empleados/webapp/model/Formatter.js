sap.ui.define([], function() {
    "use strict";

    return {
        formatearFecha: function (sFecha) {
            if (sFecha !== undefined && sFecha !== "") {
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd MMM yyyy"});
                var sFechaFormateada = dateFormat.format(sFecha);
                return sFechaFormateada;
            }
        }
    }
});