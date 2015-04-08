var ReporteController = require('./reporte_controller.js');

class KilosVendidosController extends ReporteController{
    constructor(service){
        super(service);
        this.init();
        this.kilos = [];
    }

    init(){
        this.service.findAll(this.llenarKilos.bind(this));
    }

    llenarKilos(data){
        this.kilos = data.map(function(kilo){
            kilo.trabajador.getNombreCompleto = function(){
                return this.nombre + ' ' + this.apellido;
            };

            return kilo;
        });
    }

    filtrar(){
        console.log('filtrando desde %s hasta %s', this.desde, this.hasta);
    }

    exportar(){
        console.log('exportando desde %s hasta %s', this.desde, this.hasta);
    }

    graficar(){
        console.log('graficando desde %s hasta %s', this.desde, this.hasta);
    }
}

module.exports = KilosVendidosController;
