const FIJO = 1;
const PORCENTAJE = 2;

var ReporteController = require('./reporte_controller.js');
var graphData = require('../../utils/reporte_graph_data.js');

class ConsumoClienteController extends ReporteController{
    constructor(service){
        super(service);
        this.consumos = null;
        this.service.findAll(this.cargaConsumos.bind(this));
    }

    cargaConsumos(data){
        this.consumos = data.map((d)=>{
            var descripcion = 'Sin descuento';

            if(d.descuento.tipo === FIJO){
                descripcion = '$' + d.descuento.monto + ' en ( ' + d.descuento.producto + ' )';
            }else if(d.descuento.tipo === PORCENTAJE){
                descripcion = d.descuento.monto + '% en ( ' + d.descuento.producto + ' )';
            }

            d.descuento.descripcion = descripcion;
            return d;
        });
    }

    filtrar(){
        this.service.filtrar(this.desde, this.hasta, ()=>{
            this.cargaConsumos.bind(this);
            $('#tabDetalle').tab('show');
        });
    }

    exportar(){
        console.log('exportando');
    }

    graficar(){
        $('#tabGrafico').tab('show');
        var data = graphData;

        data.title.text = 'Consumo de clientes';
        data.yAxis.title.text = 'Cantidad ( cu )';
        data.series = [
            {
                name: 'cod 1105',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            },
            {
                name: 'cod 1145',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }
        ];

        $('#canvas_grafico').highcharts(data);
    }
}

module.exports = ConsumoClienteController;
