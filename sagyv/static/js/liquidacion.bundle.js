(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion_controller.js":[function(require,module,exports){
function LiquidacionController($http){
    this.productos = [];
    this.idVehiculo = null;
    this.numeroGuia = null;
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.http = $http;

    this.vehiculo = {
        kilometrosRecorridos : 0,
        kmActual : 0
    };
}

LiquidacionController.prototype = {
    constructor: LiquidacionController,

    buscarGuia: function(){
        var url = App.urls.get("liquidacion:obtener_guia"),
            _this = this;

        url += "?id_vehiculo=" + this.idVehiculo;
        this.resetearValores();

        this.http.get(url).success(function(data){
            _this.productos = data.productos;
            _this.vehiculo = data.vehiculo;
            _this.vehiculo.kilometrosRecorridos = 0;
        });
    },

    actualizarKilometraje: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    },

    calcularSubTotal: function(){
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
        this.numeroGuia = null;
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    }
};

module.exports = LiquidacionController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/producto_controller.js":[function(require,module,exports){
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js":[function(require,module,exports){
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

},{"./controllers/liquidacion_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion_controller.js","./controllers/producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/producto_controller.js"}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js"]);
