(function(){
    var app = angular.module("vehiculoApp",[]);

    app.controller("VehiculoController", ["$http", function($http){
        this.idVehiculo = null;
        this.numeroGuia = null;
        this.productos = [];

        var controller = this;

        this.buscar = function(){
            var url = App.urls.get("liquidacion:obtener_guia"),
                json = { numero_guia : this.numeroGuia };

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

        this.liquidar = function(){
            console.log(this.productos);
        };
    }]);
})();
