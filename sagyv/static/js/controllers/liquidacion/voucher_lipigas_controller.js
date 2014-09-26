var VoucherLipigas = require('./../../models/liquidacion/voucher_lipigas_model.js');

function VoucherLipigasController($http, $scope){
    this.scope = $scope;

    this.numero = 0;
    this.terminal = null;
    this.tarjeta = null;
    this.monto = null;
    this.descuento = 0;

    this.voucher = null;
    this.mensajes = {};
}

VoucherLipigasController.mixin({
    resetearVoucher: function(){
        this.voucher = new VoucherLipigas();
    },

    addTarjeta: function(){
        if(!this._esValidaTarjeta()){
            return;
        }

        var tarjeta = {
            id: this.tarjeta,
            nombre: $('#tarjeta_comercial_lipigas option:selected').text(),
            monto: this.monto
        };

        this.voucher.addTarjeta(tarjeta);
        this.tarjeta = null;
        this.monto = null;
    },

    removeTarjeta: function(index){
        this.voucher.removeTarjeta(index);
    },

    guardar: function(){
        this.voucher.numero = this.numero;
        this.scope.$emit("guia:agregarVoucher", this.voucher);

        $('#modal_voucher_lipigas').modal('hide');
        common.agregarMensaje('El voucher de lipigas ha sido agregado exitosamente');
    },

    _esValidaTarjeta: function(){
        if(!this.tarjeta){
            this.mensajes.tarjeta = 'Debe seleccionar una tarjeta';
            return false;
        }

        if(!this.monto || isNaN(this.monto) || parseInt(this.monto) < 1){
            this.mensajes.tarjeta = 'Debe elegir un monto válido';
            return false;
        }

        return true;
    },

    hacerDescuento: function(){
        var descuento = parseInt(this.descuento);

        if(isNaN(descuento)){
            descuento = 0;
        }

        this.voucher.setDescuento(descuento);
    }
});

module.exports = VoucherLipigasController;
