var ReporteController = require('./reporte_controller.js');

function CreditoController(){
    ReporteController.call(this);
}

CreditoController.mixin(ReporteController, {});

module.exports = CreditoController;
