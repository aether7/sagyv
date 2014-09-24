(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js":[function(require,module,exports){
var Producto = require("./../../models/producto_model.js");

function GuiaPropiaController($http, $scope){
    this.idCliente = null;
    this.descripcionDescuento = "nada";
    this.http = $http;
    this.scope = $scope;
    this.cliente = {};
    this.productoSeleccionado = {};
    this.productosSeleccionados = [];

    this.descuento = {};
    this.mensajes = {};
}

GuiaPropiaController.mixin({
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

        this.descuento.codigo = data.situacion_comercial.codigo;
        this.descuento.credito = data.situacion_comercial.con_credito;
        this.descuento.simbolo = data.situacion_comercial.simbolo;
        this.descuento.cantidad = data.situacion_comercial.monto;
    },

    agregarProducto: function(){
        var obj,
            producto = null;

        if(!this.esValidoProducto()){
            return;
        }

        obj = JSON.parse(this.productoSeleccionado.tipo);

        producto = new Producto();
        producto.cantidad = this.productoSeleccionado.cantidad;
        producto.precio = obj.precio;
        producto.codigo = obj.codigo;
        producto.descuento = this.descuento;
        producto.calcularTotal();

        this.productosSeleccionados.push(producto);
        this.productoSeleccionado = {};
    },

    esValidoProducto: function(){
        this.mensajes = {};

        if(!this.productoSeleccionado.tipo){
            this.mensajes.producto = "No se ha seleccionado que producto se desea agregar";
            return false;
        }

        obj = JSON.parse(this.productoSeleccionado.tipo);

        if(!this.productoSeleccionado.cantidad || parseInt(this.productoSeleccionado.cantidad) < 1){
            this.mensajes.producto = "Se debe ingresar una cantidad de producto";
            return false;
        }else if(obj.cantidad < parseInt(this.productoSeleccionado.cantidad)){
            this.mensajes.producto = "No se puede elegir una mayor a la disponible";
            return false;
        }

        return true;
    },

    eliminarProducto: function(index){
        this.productosSeleccionados.splice(index, 1);
    }
});

module.exports = GuiaPropiaController;

},{"./../../models/producto_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/producto_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js":[function(require,module,exports){
function LiquidacionController($http, $scope){
    this.productos = [];
    this.boleta = null;

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
        this.boleta = data.boleta;
        this.guia.boleta = data.boleta.actual;
        this.guia.fecha = new Date();

        this.productos = this.scope.productos = data.productos;

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
    },

    cerrarLiquidacion: function(){
        var url = App.urls.get("liquidacion:cerrar");
        window.location.href = url;
    }
};

module.exports = LiquidacionController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js":[function(require,module,exports){
function ProductoController($scope){
    this.scope = $scope;
}

ProductoController.prototype = {
    constructor: ProductoController,

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
    LiquidacionController = require("./controllers/liquidacion/liquidacion_controller.js"),
    ProductoController = require("./controllers/liquidacion/producto_controller.js"),
    GuiaPropiaController = require("./controllers/liquidacion/guia_propia_controller.js");

app.controller("LiquidacionController", ["$http","$scope", LiquidacionController]);
app.controller("ProductoController", ["$scope", ProductoController]);
app.controller("GuiaPropiaController", ["$http", "$scope", GuiaPropiaController]);

})();

$("button[data-accion=abre_modal]").on("click", function(evt){
    $("#modal_" + $(this).data("modal")).modal("show");
});

},{"./controllers/liquidacion/guia_propia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js","./controllers/liquidacion/liquidacion_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js","./controllers/liquidacion/producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/producto_model.js":[function(require,module,exports){
function Producto(){
    this.codigo = null;
    this.cantidad = null;
    this.descuento = null;
    this.montoDescuento = 0;
    this.precio = null;
    this.total = null;

    this.mensajes = {};
}

Producto.mixin({
    calcularTotal: function(){
        var subtotal = parseInt(this.precio) * parseInt(this.cantidad);
        this.total = this.calcularDescuento(subtotal);
    },

    calcularDescuento: function(subtotal){
        var neto = subtotal;

        if(this.descuento.credito){
            return neto;
        }

        if(this.descuento.simbolo === '%'){
            neto = this._descontarPorcentual(subtotal, this.descuento.cantidad);
        }else if(this.descuento.simbolo === '$'){
            neto = this._descontarFijo(subtotal, this.descuento.cantidad);
        }

        return neto;
    },

    _descontarPorcentual: function(subtotal, cantidadPorcentual){
        var montoDescuento, monto;

        montoDescuento = (subtotal * cantidadPorcentual) / 100.0;
        monto = subtotal - montoDescuento;
        this.montoDescuento = montoDescuento;

        return monto;
    },

    _descontarFijo: function(subtotal, descuento){
        var monto = subtotal,
            montoDescuento;

        if(this.codigo === this.descuento.codigo){
            montoDescuento = descuento * this.cantidad;
            monto = monto - montoDescuento;
            this.montoDescuento = montoDescuento;
        }

        return monto;
    }
});

module.exports = Producto;

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js"]);
