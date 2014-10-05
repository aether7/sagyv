function Venta(tipo){
    this.numero = 0;
    this.total = 0;
    this.tipo = tipo;
    this.cliente = {};
    this.productos = [];
}

Venta.mixin({
    addProducto: function(producto){
        this.productos.push(producto);
        this._calcularTotal();
    },

    removeProducto: function(index){
        this.productos.splice(index, 1);
        this._calcularTotal();
    },

    _calcularTotal: function(){
        var total = 0;

        this.productos.forEach(function(producto){
            total += parseInt(producto.total);
        });

        this.total = total;
    }
});

module.exports = Venta;
