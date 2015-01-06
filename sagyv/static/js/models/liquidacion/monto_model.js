function Monto(){
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.propias = 0;
    this.lipigas = 0;
    this.voucherLipigas = 0;
    this.voucherTransbank = 0;
    this.cheques = 0;
    this.cupones = 0;
    this.otros = 0;
}

Monto.prototype = {
    constructor: Monto,

    calcularSubtotal: function(productos){
        var i, producto;
        this.subTotal = 0;

        for(i = 0; i < productos.length; i++){
            producto = productos[i];
            this._sumarSubtotal(producto);
        }

        this.total = this.subTotal + this.descuentos;
    },

    _sumarSubtotal: function(producto){
        if(isNaN(producto.valorTotal)){
            return;
        }

        this.subTotal += producto.valorTotal;
    },

    sumarGuias: function(guiasPropias, guiasLipigas){
        var _this = this;
        this.propias = this.lipigas = 0;

        guiasPropias.forEach(function(venta){
            _this.propias += venta.total;
        });

        guiasLipigas.forEach(function(venta){
            _this.lipigas += venta.total;
        });
    },

    calcularCuponesPrepago: function(cupones){
        this.cupones = 0;

        for(var i = 0; i < cupones.length; i++){
            this.cupones += cupones[i].descuento;
        }
    }
}

module.exports = Monto;
