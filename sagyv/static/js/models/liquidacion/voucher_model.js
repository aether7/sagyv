function Voucher(){
    this.numero = null;
    this.tarjetas = [];
    this.descuento = 0;
    this.total = 0;
}

Voucher.mixin({
    setDescuento: function(descuento){
        if(isNaN(descuento)){
            throw new TypeError('El descuento debe ser numérico');
        }

        this.descuento = descuento;
        this._calcularTotal();
    },

    addTarjeta: function(tarjeta){
        this.tarjetas.push(tarjeta);
        this._calcularTotal();
    },

    removeTarjeta: function(index){
        this.tarjetas.splice(index, 1);
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

module.exports = Voucher;
