var CuponPrepago = require('./../../models/liquidacion/cupon_prepago_model.js');

function CuponPrepagoController($scope){
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

        var clientePrepago = $('#cliente_prepago option:selected'),
            formatoPrepago = $('#formato_prepago option:selected');

        this.cuponPrepago.descuento = parseInt(formatoPrepago.data('descuento'));
        this.cuponPrepago.clienteNombre = clientePrepago.text();
        this.cuponPrepago.formatoNombre = formatoPrepago.text();

        this.scope.$emit('guia:agregarCuponesPrepago', this.cuponPrepago.getJSON());
        $('#modal_cupones_prepago').modal('hide');
    }
});

module.exports = CuponPrepagoController;
