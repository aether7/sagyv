function TransitoController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.resultados = null;
}

TransitoController.mixin({
    verDetalle: function(id){
        var _this = this;

        this.service.findVehiculoByProducto(id, function(data){
            _this.resultados = data;
            $('#modal_ver_detalle').modal('show');
        });
    }
});

module.exports = TransitoController;
