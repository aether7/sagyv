var VoucherTransbank = require('./../../models/liquidacion/voucher_transbank_model.js');

function VoucherTransbankController($scope){
    this.voucher = null;
    this.scope = $scope;

    this.idTarjeta = null;
    this.monto = 0;
    this.num_operacion = null;

    this.mensajes = {};
}

VoucherTransbankController.mixin({
    addTarjeta: function(){
        if(!this._esValidaTarjeta()){
           return;
        }

        var tarjeta = {
            id: this.idTarjeta,
            nombre: $('#tarjeta_comercial_transbank option:selected').text(),
            monto: this.monto,
            num_operacion: this.num_operacion
        };

        this.voucher.addTarjeta(tarjeta);

        this.idTarjeta = null;
        this.monto = 0;
        this.num_operacion = null;
    },

    removeTarjeta: function(index){
        this.voucher.removeTarjeta(index);
    },

    guardar: function(){
        if(!this._esValidaVenta()){
            return;
        }

        this.scope.$emit('guia:agregarVoucher', this.voucher);

        console.log(this.voucher);

        $('#modal_voucher_transbank').modal('hide');
        common.agregarMensaje('Los vouchers han sido guardados exitosamente');
    },

    resetearVoucher: function(){
        this.voucher = new VoucherTransbank();
    },

    _esValidaTarjeta: function(){
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

        if(!this.num_operacion){
            this.mensajes.num_operacion = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.num_operacion)){
            this.mensajes.num_operacion = 'valor inválido';
            valido = false;
        }else if(parseInt(this.num_operacion) < 1){
            this.mensajes.num_operacion = 'el numero de operacion a ingresar debe ser mayor a 0';
            valido = false;
        }

        return valido;
    },

    _esValidaVenta: function(){
        this.mensajes = {};

        if(!this.voucher.tarjetas.length){
            this.mensajes.tarjeta = 'Debe al menos ingresar una tarjeta';
            return false;
        }

        return true;
    }
});

module.exports = VoucherTransbankController;
