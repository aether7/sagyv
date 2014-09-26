var VoucherTransbank = require('./../../models/liquidacion/voucher_transbank_model.js');

function VoucherTransbankController($http, $scope){
    this.voucher = null;
    this.scope = $scope;

    this.idTarjeta = null;
    this.monto = 0;
    this.cuotas = 1;

    this.mensajes = {};
}

VoucherTransbankController.mixin({
    addTarjeta: function(){
        if(!this.esValido()){
           return;
        }

        var tarjeta = {
            id: this.idTarjeta,
            nombre: $('#tarjeta_comercial_transbank option:selected').text(),
            monto: this.monto,
            cuotas: this.cuotas
        };

        this.voucher.addTarjeta(tarjeta);

        this.idTarjeta = null;
        this.monto = 0;
        this.cuotas = 1;
    },

    removeTarjeta: function(index){
        this.voucher.removeTarjeta(index);
    },

    esValido: function(){
        var valido = true;

        this.mensajes = {};

        if(!this.idTarjeta){
            this.mensajes.tarjeta = 'campo obligatorio';
            valido = false;
        }

        if(!this.monto){
            this.mensajes.monto = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.monto)){
            this.mensajes.monto = 'monto inválido';
            valido = false;
        }else if(parseInt(this.monto) < 1){
            this.mensajes.monto = 'el monto a ingresar debe ser mayor a 0';
        }

        if(!this.cuotas){
            this.mensajes.cuotas = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.cuotas)){
            this.mensajes.cuotas = 'valor inválido';
            valido = false;
        }else if(parseInt(this.cuotas) < 1){
            this.mensajes.cuotas = 'el monto a ingresar debe ser mayor a 0';
            valido = false;
        }

        return valido;
    },

    guardar: function(){
        this.scope.$emit('guia:agregarVoucher', this.voucher);

        $('#modal_voucher_transbank').modal('hide');
        common.agregarMensaje('Los vouchers han sido guardados exitosamente');
    },

    resetearVoucher: function(){
        this.voucher = new VoucherTransbank();
    }
});

module.exports = VoucherTransbankController;
