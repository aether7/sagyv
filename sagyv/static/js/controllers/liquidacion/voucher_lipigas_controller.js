var VoucherLipigas = require('./../../models/liquidacion/voucher_lipigas_model.js');

function VoucherLipigasController($scope){
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
        this.mensajes = {};
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
        if(!this._esValidaVenta()){
            return;
        }

        this.voucher.numero = this.numero;
        this.scope.$emit("guia:agregarVoucher", this.voucher);

        $('#modal_voucher_lipigas').modal('hide');
        common.agregarMensaje('El voucher de lipigas ha sido agregado exitosamente');
    },

    hacerDescuento: function(){
        var descuento = parseInt(this.descuento);

        if(isNaN(descuento)){
            descuento = 0;
        }

        this.voucher.setDescuento(descuento);
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

    _esValidaVenta: function(){
        var valido = true;
        this.mensajes = {};

        if(!this.numero){
            this.mensajes.numero = 'campo obligatorio';
            valido = false;
        }

        if(!this.terminal){
            this.mensajes.terminal = 'campo obligatorio';
            valido = false;
        }

        if(!this.voucher.tarjetas.length){
            this.mensajes.tarjeta = 'debe ingresar al menos 1 tarjeta';
            valido = false;
        }

        return valido;
    }
});

module.exports = VoucherLipigasController;
