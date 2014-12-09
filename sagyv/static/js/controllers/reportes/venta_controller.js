var ReporteController = require('./reporte_controller.js');

function VentaController(){
    ReporteController.call(this);
}

VentaController.mixin(ReporteController, {});

module.exports = VentaController;
