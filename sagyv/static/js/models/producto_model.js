function Producto(){
    this.codigo = null;
    this.cantidad = null;
    this.descuento = null;
    this.montoDescuento = 0;
    this.precio = null;
    this.total = null;

    this.mensajes = {};
}

Producto.mixin({
    calcularTotal: function(){
        var subtotal = parseInt(this.precio) * parseInt(this.cantidad);
        this.total = this.calcularDescuento(subtotal);
    },

    calcularDescuento: function(subtotal){
        var neto = subtotal;

        if(this.descuento.credito){
            return neto;
        }

        if(this.descuento.simbolo === '%'){
            neto = this._descontarPorcentual(subtotal, this.descuento.cantidad);
        }else if(this.descuento.simbolo === '$'){
            neto = this._descontarFijo(subtotal, this.descuento.cantidad);
        }

        return neto;
    },

    _descontarPorcentual: function(subtotal, cantidadPorcentual){
        var montoDescuento, monto;

        montoDescuento = (subtotal * cantidadPorcentual) / 100.0;
        monto = subtotal - montoDescuento;
        this.montoDescuento = montoDescuento;

        return monto;
    },

    _descontarFijo: function(subtotal, descuento){
        var monto = subtotal,
            montoDescuento;

        if(this.codigo === this.descuento.codigo){
            montoDescuento = descuento * this.cantidad;
            monto = monto - montoDescuento;
            this.montoDescuento = montoDescuento;
        }

        return monto;
    }
});

module.exports = Producto;
