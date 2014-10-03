function TransitoController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.resultados = null;
    this.productosTransito = [];

    this.recargarTransito();
    this.addListeners();
}

TransitoController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarProductos', this.recargarTransito.bind(this));
    },

    recargarTransito: function(){
        var self = this;

        this.service.findProductosTransito(function(productosTransito){
            self.productosTransito = productosTransito;
        });
    },

    verDetalle: function(id){
        var _this = this;

        this.service.findVehiculoByProducto(id, function(data){
            _this.resultados = data;
            $('#modal_ver_detalle').modal('show');
        });
    }
});

module.exports = TransitoController;
