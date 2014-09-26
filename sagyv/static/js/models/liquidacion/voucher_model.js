function Voucher(tipo){
    this.tipo = tipo;
    this.tarjetas = [];
    this.total = 0;
}

Voucher.mixin({
    addTarjeta: function(tarjeta){
        this.tarjetas.push(tarjeta);
        this._calcularTotal();
    },

    removeTarjeta: function(index){
        this.tarjetas.splice(index, 1);
        this._calcularTotal();
    },

    _calcularTotal: function(){
        throw new Error('Método no implementado: _calcularTotal');
    }
});

module.exports = Voucher;
