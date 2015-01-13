function PanelBusquedaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.idGuiaDespacho = null;

    this.kilosVendidos = 0;
    this.vehiculo = {};
    this.guia = {};
    this.boleta = {};
}

PanelBusquedaController.prototype = {
    constructor: PanelBusquedaController,

    buscar: function(){
        if(!this.idGuiaDespacho){
            return;
        }

        this.service.buscarGuia(this.idGuiaDespacho, this.procesarBusqueda.bind(this));
    },

    procesarBusqueda: function(data){
        if(data.boleta.mensaje){
            alert(data.boleta.mensaje);
            return;
        }

        this.boleta = data.boleta;
        this.guia = data.guia;
        this.guia.fecha = common.fecha.djangoToDate(this.guia.fecha);
        this.vehiculo = data.vehiculo;

        $("#guia_despacho_ls").val(data.guia.id);

        this.scope.$emit('liquidacion:addProductos', data.productos);
    },

    actualizarKm: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    }
};

module.exports = PanelBusquedaController;
