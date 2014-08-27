(function(){
"use strict";

var app = angular.module("liquidacionApp",[]),
    LiquidacionController = require("./controllers/liquidacion_controller.js"),
    ProductoController = require("./controllers/producto_controller.js");

function ClienteController($http){
    this.idCliente = null;
    this.descripcionDescuento = "nada";
    this.http = $http;

    this.cliente = {};
}

ClienteController.prototype = {
    constructor: ClienteController,

    buscarCliente: function(){
        var url = App.urls.get("liquidacion:buscar_cliente");
        url += "?id_cliente=" + this.idCliente;

        this.http.get(url).success(this.procesarCliente.bind(this));
    },

    procesarCliente: function(data){
        this.cliente.id = data.id;
        this.cliente.direccion = data.direccion;
        this.cliente.rut = data.rut;
        this.situacionComercial = data.situacion_comercial;
        this.descripcionDescuento = data.situacion_comercial.descripcion_descuento;
    }
};

app.controller("LiquidacionController", ["$http","$scope", LiquidacionController]);
app.controller("ProductoController", ["$scope", ProductoController]);
app.controller("ClienteController", ["$http", ClienteController]);

})();

(function(){
    $("button[data-accion=abre_modal]").on("click", function(evt){
        common.mostrarModal($(this).data("modal"));
    });
})();
