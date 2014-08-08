(function(){
    var app = angular.module("vehiculoApp",[]);

    app.controller("VehiculoController", ["$http", function($http){
        var controller = this;

        this.idVehiculo = null;
        this.numeroGuia = null;
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
        this.productos = [];

        this.buscar = function(){
            var url = App.urls.get("liquidacion:obtener_guia");
            url += "?numero_guia=" + this.numeroGuia;

            $http.get(url).success(function(data){
                controller.productos = data.productos;
            });
        };

        this.calcularRestante = function(producto){
            producto.llenos = producto.cantidad - producto.vacios;

            if(isNaN(producto.llenos)){
                producto.llenos = 0;
            }

            return producto.llenos;
        };

        this.calcularPrecio = function(producto){
            var precioTotal = parseInt(producto.precio) * parseInt(producto.vacios);

            if(isNaN(precioTotal)){
                precioTotal = 0;
            }

            return precioTotal;
        };

        this.calcularSubTotal = function(){
            this.subTotal = 0;

            this.productos.forEach(function(producto){
                controller.subTotal += parseInt(producto.precio) * parseInt(producto.vacios);
            });

            return this.subTotal;
        };

        this.calcularTotal = function(){
            return this.subTotal - this.descuentos;
        };

        this.liquidar = function(){
            console.log(this.productos);
        };
    }]);
})();
