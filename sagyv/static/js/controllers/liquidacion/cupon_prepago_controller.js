var CuponPrepago = require('./../../models/liquidacion/cupon_prepago_model.js');

function CuponPrepagoController($http, $scope){
    this.http = $http;
    this.scope = $scope;
    this.cuponPrepago = null;
}

CuponPrepagoController.mixin({
    resetearCuponPrepago: function(){
        this.cuponPrepago = new CuponPrepago();
    },

    guardarCuponPrepago: function(){
        if(!this.cuponPrepago.esValido()){
            return;
        }

        this.cuponPrepago.clienteNombre = $('#cliente_prepago option:selected').text();
        this.cuponPrepago.formatoNombre = $('#formato_prepago option:selected').text();

        this.scope.emit();
        $('#modal_cupones_prepago').modal('hide');
    }
});

module.exports = CuponPrepagoController;
