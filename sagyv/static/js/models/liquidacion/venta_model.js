function Venta(){
    this.numero = 0;
    this.total = 0;
    this.tipoVenta = null;
    this.cliente = {};
    this.productos = [];
}

Venta.mixin({
    addProducto: function(producto){
        this.productos.push(producto);
    },

    removeProducto: function(index){
        this.productos.splice(index, 1);
    },

    calcularTotal: function(){
        var total = 0;

        this.productos.forEach(function(producto){
            total += parseInt(producto.total);
        });

        this.total = total;
    }
});

module.exports = Venta;
