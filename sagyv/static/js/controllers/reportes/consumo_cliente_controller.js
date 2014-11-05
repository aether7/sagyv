var ReporteController = require('./reporte_controller.js');

function ConsumoClienteController(service){
    ReporteController.call(this, service);
    this.consumos = [];
    this.init();
}

ConsumoClienteController.mixin(ReporteController, {
    init: function(){
        this.service.findAll(this.cargaConsumos.bind(this));
    },

    cargaConsumos: function(data){
        this.consumos = data;
    }
});

module.exports = ConsumoClienteController;
