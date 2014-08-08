(function(){
    var app = angular.module("vehiculoApp",[]);

    app.controller("VehiculoController", function(){
        this.idVehiculo = null;
        this.numeroGuia = null;
        this.productos = [];

        this.buscar = function(){
            this.productos = [{
                id : 1,
                codigo : 1414,
                cantidad : 20,
                precio : 1000
            }];

            var url = App.urls.get("liquidacion:obtener_guia"),
                json = { numero_guia : this.numeroGuia },
                _this = this;

            $.get(url, json, function(data){
                console.log(data);
            });
        };

        this.calcularRestante = function(producto){
            producto.llenos = producto.cantidad - producto.vacios;
            return producto.llenos;
        };

        this.liquidar = function(){
            console.log(this.productos);
        };
    });
})();
