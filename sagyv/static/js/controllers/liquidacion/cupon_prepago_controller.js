var CuponPrepago = require('./../../models/liquidacion/cupon_prepago_model.js');

function CuponPrepagoController($scope, calcularRestanteService){
    this.scope = $scope;
    this.cuponPrepago = null;
    this.calcularRestanteService = calcularRestanteService;
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

        this.scope.productos = this.calcularRestanteService.calculaRestantes(this.scope.productos);

        if(!this.calcularRestanteService.tieneStockDisponible(this.cuponPrepago.formatoNombre, 1)){
            this.cuponPrepago.mensajes.formatoId = 'No se puede elegir una mayor a la disponible';
            return;
        }

        var venta = [{'cantidad':1, 'codigo': this.cuponPrepago.formatoNombre}]
        this.scope.productos = this.calcularRestanteService.restar(this.scope.productos, venta);

        this.scope.$emit('guia:agregarCuponesPrepago', this.cuponPrepago.getJSON());
        $('#modal_cupones_prepago').modal('hide');
    }
});

module.exports = CuponPrepagoController;
