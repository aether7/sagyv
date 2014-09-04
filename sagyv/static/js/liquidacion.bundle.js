(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion_controller.js":[function(require,module,exports){
function LiquidacionController($http, $scope){
    this.productos = [];

    this.guia = {};

    this.idVehiculo = null;
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.fecha = null;
    this.vehiculo = null;

    this.http = $http;
    this.scope = $scope;

    this.suscribeEvents();
}

LiquidacionController.prototype = {
    constructor: LiquidacionController,

    buscarGuia: function(){
        var url = App.urls.get("liquidacion:obtener_guia"),
            _this = this;

        url += "?id_vehiculo=" + this.idVehiculo;

        this.resetearValores();
        this.http.get(url).success(this.cargaDatosCabecera.bind(this));
    },

    cargaDatosCabecera: function(data){
        this.guia = data.guia;
        this.guia.fecha = new Date();

        this.productos = data.productos;

        this.vehiculo = data.vehiculo;
        this.vehiculo.kilometrosRecorridos = 0;
        this.vehiculo.kmActual = 0;
    },

    actualizarKilometraje: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    },

    calcularSubTotal: function(){
        var _this = this;

        this.subTotal = 0;

        this.productos.forEach(function(producto){
            if(isNaN(producto.valorTotal)){
                return;
            }

            _this.subTotal += producto.valorTotal;
        });

        this.total = this.subTotal - this.descuentos;
    },

    resetearValores: function(){
        this.idCliente = null;
        this.guia = {};
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    },

    suscribeEvents: function(){
        this.scope.$on("guia:calcularSubTotal", this.calcularSubTotal.bind(this));
    }
};

module.exports = LiquidacionController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/producto_controller.js":[function(require,module,exports){
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js":[function(require,module,exports){
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

    resetearCliente: function(){
        this.idCliente = null;
        this.descripcionDescuento = "nada";
    },

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

$("button[data-accion=abre_modal]").on("click", function(evt){
    $("#modal_" + $(this).data("modal")).modal("show");
});

},{"./controllers/liquidacion_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion_controller.js","./controllers/producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/producto_controller.js"}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js"]);
