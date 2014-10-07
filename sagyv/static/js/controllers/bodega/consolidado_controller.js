function ConsolidadoController($scope, service){
    this.scope = $scope;
    this.service = service;

    this.consolidados = [];
    this.productoConsolidado = {};

    this.addListeners();
    this.obtenerConsolidados();
}

ConsolidadoController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarProductos', this.obtenerConsolidados.bind(this));
    },

    obtenerConsolidados: function(){
        this.service.findConsolidados(this.renderConsolidados.bind(this));
    },

    renderConsolidados: function(data){
        this.consolidados = data;
    },

    verDetalle: function(index){
        var prod = this.consolidados[index],
            _this = this;

        this.service.findDetalleConsolidado(prod.id, function(data){
            _this.productoConsolidado.codigo = prod.codigo;
            _this.productoConsolidado.cantidadBodega = data.bodega;
            _this.productoConsolidado.vehiculos = data.transito;
            $('#modal_consolidados').modal('show');
        });
    }
});

module.exports = ConsolidadoController;
