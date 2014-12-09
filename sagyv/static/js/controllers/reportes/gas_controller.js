var ReporteController = require('./reporte_controller.js');

function GasController(service){
    ReporteController.call(this, service);
}

GasController.mixin(ReporteController, {
    filtrar: function(){
        var fechaInicio = this.desde,
            fechaTermino = this.hasta;

        console.log('fecha inicio : ' + fechaInicio);
        console.log('fecha termino : ' + fechaTermino);

        this.service.findAll(function(data){
            console.log('llegando del server');
            console.log(data);
        });
    },

    exportar: function(){
        console.log('exportando');
    },

    graficar: function(){
        console.log('graficando');
    }
});

module.exports = GasController;
