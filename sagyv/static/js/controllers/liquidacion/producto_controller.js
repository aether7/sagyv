function ProductoController($scope){
    this.scope = $scope;
}

ProductoController.mixin({
    calculaValorTotal: function(producto){
        var valorTotal = 0;
        valorTotal = parseInt(producto.vacios) * parseInt(producto.precio);

        if(isNaN(valorTotal)){
            valorTotal = 0;
        }

        producto.valorTotal = valorTotal;
    },

    calcularRestante: function(producto){
        producto.calcularRestante();

        this.calculaValorTotal(producto);
        this.scope.$emit('guia:calcularSubTotal');
        this.scope.$emit('guia:calcularKilos');
    }
});

module.exports = ProductoController;
