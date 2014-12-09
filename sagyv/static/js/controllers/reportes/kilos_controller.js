var ReporteController = require('./reporte_controller.js');

function KilosController(){
    ReporteController.call(this);
}

KilosController.mixin(ReporteController, {});

module.exports = KilosController;
