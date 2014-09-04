function ProductoController($scope){
    this.scope = $scope;
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
        var aux = parseInt(producto.cantidad) - parseInt(producto.llenos);

        if(isNaN(aux) || aux < 0){
            aux = 0;
        }

        if(producto.cantidad < parseInt(producto.llenos)){
            producto.llenos = producto.cantidad;
        }

        producto.vacios = aux;
        this.calculaValorTotal(producto);
        this.scope.$emit("guia:calcularSubTotal");
    }
};

module.exports = ProductoController;
