(function(){
    var app = angular.module("liquidacionApp",[]);

    app.controller("LiquidacionController", ["$http",function($http){
        this.productos = [];
        this.idVehiculo = null;
        this.numeroGuia = null;
        this.subTotal = null;
        this.descuentos = null;
        this.total = null;

        var _this = this;

        this.buscarGuia = function(){
            var url = App.urls.get("liquidacion:obtener_guia");
                url += "?numero_guia=" + this.numeroGuia;

            $http.get(url).success(function(data){
                _this.productos = data.productos;
            });
        };
    }]);

    app.controller("ProductoController", function(){
        this.producto = null;
        this.precio = 0;
        this.cantidad = 0;
        this.llenos = 0;
        this.vacios = 0;

        this.calcularRestante = function(producto){
            this.producto = producto;
            this.precio = producto.precio;
            this.cantidad = producto.cantidad;
            this.vacios = producto.vacios;

            this.llenos = parseInt(this.cantidad) - (this.vacios);

            if(isNaN(this.llenos)){
                this.llenos = 0;
            }

            this.producto.llenos = this.llenos;
            return this.llenos;
        };

        this.calcularPrecio = function(producto){
            var precioTotal = parseInt(producto.precio) * parseInt(producto.vacios);

            if(isNaN(precioTotal)){
                precioTotal = 0;
            }

            return precioTotal;
        };
    });

    /*
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
    */
})();
