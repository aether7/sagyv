function ProductoController(){
}

ProductoController.prototype = {
    calculaValorTotal: function(producto){
        var valorTotal = 0;
        valorTotal = parseInt(producto.vacios) * parseInt(producto.precio);

        if(isNaN(valorTotal)){
            valorTotal = 0;
        }

        producto.valorTotal = valorTotal;
    },

    calcularRestante: function(producto){
        var aux = parseInt(producto.cantidad) - parseInt(producto.vacios);

        if(isNaN(aux) || aux < 0){
            aux = 0;
        }

        if(producto.cantidad < parseInt(producto.vacios)){
            producto.vacios = producto.cantidad;
        }

        producto.llenos = aux;
        calculaValorTotal(producto);

        return producto.llenos;
    }
};

module.exports = ProductoController;
