class ReporteController{
    constructor(service){
        this.service = service;
        this.desde = null;
        this.hasta = null;
    }

    filtrar(){
        throw new Error('método no implementado');
    }

    exportar(){
        throw new Error('método no implementado');
    }

    graficar(){
        throw new Error('método no implementado');
    }
}

module.exports = ReporteController;
