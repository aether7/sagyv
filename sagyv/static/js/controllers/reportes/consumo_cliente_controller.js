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
        console.log('data');
        console.log(data);
        this.consumos = data;
    },

    filtrar: function(){
        var fechaInicio, fechaTermino;

        if(this.desde){
            fechaInicio = common.fecha.fechaToJSON(this.desde);
        }

        if(this.hasta){
            fechaTermino = common.fecha.fechaToJSON(this.hasta);
        }

        console.log('fecha inicio: %s', fechaInicio);
        console.log('fecha termino: %s', fechaTermino);

        this.service.filtrar(fechaInicio, fechaTermino, this.cargaConsumos.bind(this));
        $('#tabDetalle').tab('show');
    },

    graficar: function(){
        $('#tabGrafico').tab('show');

        $('#canvas_grafico').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        });
    }
});

module.exports = ConsumoClienteController;
