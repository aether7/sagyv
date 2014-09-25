var Voucher = require('./voucher_model.js');

function VoucherLipigas(){
    Voucher.call('lipigas');
    this.descuento = 0;
    this.numero = null;
}

VoucherLipigas.mixin(Voucher,{
    setDescuento: function(descuento){
        if(isNaN(descuento)){
            throw new TypeError('El descuento debe ser numérico');
        }

        this.descuento = descuento;
        this._calcularTotal();
    },

    _calcularTotal: function(){
        var _this = this;
        this.total = 0;

        this.tarjetas.forEach(function(tarjeta){
            _this.total += parseInt(tarjeta.monto);
        });

        this.total -= this.descuento;
    }
});

module.exports = VoucherLipigas;
