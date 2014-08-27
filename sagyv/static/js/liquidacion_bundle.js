(function(){
"use strict";

var app = angular.module("liquidacionApp",[]),
    LiquidacionController = require("./controllers/liquidacion_controller.js"),
    ProductoController = require("./controllers/producto_controller.js");

function ClienteController($http){
    this.idCliente = null;
    this.descripcionDescuento = "nada";
    this.cliente = {};
}

ClienteController.prototype = {
    constructor: ClienteController,

    buscarCliente: function(){
        var url = App.urls.get("liquidacion:buscar_cliente");
        url += "?id_cliente=" + this.idCliente;

        $http.get(url).success(function(data){
            _this.cliente.id = data.id;
            _this.cliente.direccion = data.direccion;
            _this.cliente.rut = data.rut;
            _this.situacionComercial = data.situacion_comercial;
            _this.descripcionDescuento = data.situacion_comercial.descripcion_descuento;
        });
    }
};

app.controller("LiquidacionController", ["$http", LiquidacionController]);
app.controller("ProductoController", ["$http", ProductoController]);
app.controller("ClienteController", ["$http", ClienteController]);

})();

(function(){
    $("button[data-accion=abre_modal]").on("click", function(evt){
        common.mostrarModal($(this).data("modal"));
    });
})();
