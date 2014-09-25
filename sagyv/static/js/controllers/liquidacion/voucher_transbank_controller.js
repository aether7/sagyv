function VoucherTransbankController($http, $scope){
    this.scope = $scope;
    this.vouchers = [];
    this.voucher = {};
    this.mensajes = {};
}

VoucherTransbankController.mixin({
    addVoucher: function(){
        if(!this.esValido()){
           return;
        }

        var voucher = {
            tarjeta:{
                id: this.voucher.tarjeta,
                nombre: $('#tarjeta_comercial_transbank option:selected').text()
            },
            monto: this.voucher.monto,
            cuotas: this.voucher.cuotas
        };

        this.vouchers.push(voucher);
        this.voucher = {};
    },

    removeVoucher: function(index){
        this.vouchers.splice(index, 1);
    },

    esValido: function(){
        var valido = true;

        this.mensajes = {};

        if(!this.voucher.tarjeta){
            this.mensajes.tarjeta = 'campo obligatorio';
            valido = false;
        }

        if(!this.voucher.monto){
            this.mensajes.monto = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.voucher.monto)){
            this.mensajes.monto = 'monto inválido';
            valido = false;
        }else if(parseInt(this.voucher.monto) < 1){
            this.mensajes.monto = 'el monto a ingresar debe ser mayor a 0';
        }

        if(!this.voucher.cuotas){
            this.mensajes.cuotas = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.voucher.cuotas)){
            this.mensajes.cuotas = 'valor inválido';
            valido = false;
        }else if(parseInt(this.voucher.cuotas) < 1){
            this.mensajes.cuotas = 'el monto a ingresar debe ser mayor a 0';
            valido = false;
        }

        return valido;
    },

    guardar: function(){
        this.scope.$emit('guia:agregarVouchers', this.vouchers);

        $('#modal_voucher_transbank').modal('hide');
        common.agregarMensaje('Los vouchers han sido guardados exitosamente');
    }
});

module.exports = VoucherTransbankController;
