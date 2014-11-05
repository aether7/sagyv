function ReporteController(service){
    this.desde = null;
    this.hasta = null;
    this.service = service;
}

ReporteController.mixin({
    filtrar: function(){
        console.log('filtrando');
    },

    exportar: function(){
        console.log('exportando');
    },

    graficar: function(){
        console.log('graficando');
    }
});

module.exports = ReporteController;
