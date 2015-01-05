function PanelBusquedaController(){
    this.idGuia = null;
    this.numGuia = null;
    this.fecha = null;
    this.numBoleta = null;
    this.kilosVendidos = 0;
    this.chofer = null;
    this.kmActual = 0;
    this.kmRecorridos = 0;
}

PanelBusquedaController.prototype = {
    constructor: PanelBusquedaController,

    buscar: function(){

    }
};

module.exports = PanelBusquedaController;
