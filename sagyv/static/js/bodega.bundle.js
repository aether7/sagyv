(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bodega_bundle.js":[function(require,module,exports){
(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.httpProvider),
    BodegaController = require("./controllers/bodega_controller.js"),
    GuiaController = require("./controllers/guia_controller.js"),
    TransitoController = require("./controllers/transito_controller.js"),
    GuiaProductoController = require("./controllers/guia_producto_controller.js");

app.controller("BodegaController", ["$http", BodegaController]);
app.controller("GuiaController", ["$http", GuiaController]);
app.controller("TransitoController", ["$http", TransitoController]);
app.controller("GuiaProductoController", ["$http", GuiaProductoController]);

})();

},{"./controllers/bodega_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega_controller.js","./controllers/guia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/guia_controller.js","./controllers/guia_producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/guia_producto_controller.js","./controllers/transito_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/transito_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega_controller.js":[function(require,module,exports){
function BodegaController($http, stop){
    this.guia = new App.Models.Guia();
    this.producto = {};
    this.http = $http;
    this.numeroGuia = null;

    if(!stop){
        this.refrescarNumeroGuia();
    }
};

BodegaController.prototype = {
    constructor: BodegaController,

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
        this.guia.numero = this.numeroGuia;
        this.producto = {};

        $("#modal_guia_despacho").modal("show");
    },

    agregarProductoDescuento: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.guia.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        this.guia.productos.splice(indice, 1);
    },

    guardarGuiaDespacho: function(){
        var json,
            action,
            valido = this.guia.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:crea_guia");
        json = this.guia.getJSON();

        this.http.post(action, json)
            .success(this.procesarGuardarGuiaDespacho.bind(this));
    },

    guardarFactura: function(){
        var json,
            action,
            valido = this.factura.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:guardar_factura");
        json = this.factura.getJSON();

        this.http.post(action, json);
    },

    procesarGuardarGuiaDespacho: function(data){
        var html,
            tpl = $("#tpl_nueva_guia").html(),
            fx = Handlebars.compile(tpl);

        html = fx({
            numero_guia: this.guia.numero,
            numero_vehiculo: this.guia.vehiculo,
            fecha_guia: this.guia.fecha
        });

        this.actualizarProductos(data);

        $("#tbl_guias tbody").append(html);
        $("#modal_guia_despacho").modal("hide");

        common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
    },

    actualizarProductos: function(data){
        data.guia.productos.forEach(function(producto){
            $("#stock_" + producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
        });
    },

    refrescarNumeroGuia: function(){
        var _this = this,
            action = App.urls.get("bodega:obtener_id_guia");

        this.http.get(action).success(function(data){
            _this.numeroGuia = data.next;

            setTimeout(function(){
                _this.refrescarNumeroGuia();
            }, 10000);
        });
    }
};

module.exports = BodegaController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/guia_controller.js":[function(require,module,exports){
function GuiaController($http){
    this.recarga = new App.Models.Recarga();
    this.http = $http;
    this.productos = [];
    console.log("lo hice");
}

GuiaController.prototype = {
    constructor: GuiaController,

    verGuia: function(id){
        var action = App.urls.get("bodega:obtener_guia"),
            _this = this;

        action += "?guia_id=" + id;

        this.http.get(action).success(function(data){
            _this.productos = data.productos;
            $("#modal_mostrar_guia").modal("show");
        });
    },

    recargarGuia: function(id){
        var action = App.urls.get("bodega:obtener_guia"),
            _this =this;

        this.recarga = new App.Models.Recarga();
        action += "?guia_id=" + id;

        this.http.get(action).success(function(data){
            _this.recarga.id = id;
            _this.recarga.numero = data.numero_guia;
            _this.recarga.vehiculo = data.movil;
            _this.recarga.fecha = common.fecha.agregarCeros(data.fecha);
            _this.recarga.productos = data.productos;

            $("#modal_recargar_guia").modal("show");
        });
    },

    agregarRecarga: function(){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }
    }
};

module.exports = GuiaController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/guia_producto_controller.js":[function(require,module,exports){
var BodegaController = require("./bodega_controller.js");

function GuiaProductoController($http){
    BodegaController.call(this, $http, true);
    this.guia = new App.Models.Factura();
    this.paso = 1;
    this.garantias = null;
    this.valorCalculado = 0;
    this.producto = {};
    this.versionAnterior = null;
}

GuiaProductoController.mixin(BodegaController,{
    nuevaFactura: function(){
        this.guia = new App.Models.Factura();
        this.producto = {}
        this.paso = 1;
        this.valorCalculado = 0;

        $("#modal_carga_producto").modal("show");
    },

    agregarProducto: function(idSelect){
        var select;

        if(this.producto.id && this.producto.cantidad){
            select = $("#" + idSelect + " option:selected");
            this.producto.codigo = select.text();
            this.producto.precio = select.data("precio") * this.producto.cantidad;
        }

        if(this.guia.agregarProducto(this.producto)){
            this.valorCalculado += this.producto.precio;
            this.producto = {};
        }
    },

    eliminarProducto: function(index){
        var producto = this.guia.productos[index];
        this.valorCalculado -= producto.precio;
        this.guia.productos.splice(index, 1);
    },

    sumarGarantias: function(){
        var garantias,
            porRegistrar = [];

        garantias = { "3105": 0, "3111": 0, "3115": 0, "3145": 0 };

        this.guia.productos.forEach(function(producto){
            var codigo = producto.codigo.split("").slice(2).join("");

            if("31" + codigo in garantias){
                garantias["31" + codigo] += parseInt(producto.cantidad);
            }
        });

        Object.keys(garantias).forEach(function(key){
            if(garantias[key]){
                porRegistrar.push({
                    codigo: key,
                    cantidad: garantias[key]
                });
            }
        });

        return porRegistrar;
    },

    guardarPaso1: function(){
        if(!this.guia.esValida()){
            return;
        }

        this.paso = 2;
        this.garantias = this.sumarGarantias();
        this.versionAnterior = JSON.stringify(this.garantias);
    },

    guardarPaso2: function(){
        var nuevoHash = JSON.stringify(this.garantias).replace(/\,\"\$\$hashKey\":\d+/g,'');

        if(this.versionAnterior !== nuevoHash){
            this.paso = 3;
            return;
        }

        this.procesarGuardado();
    },

    guardarPaso3: function(){
        alert("FELICIDADES COMPLETASTE EL PUTO LVL");
        this.procesarGuardado();
    },

    procesarGuardado: function(){
        var json,
            action,
            _this = this;

        action = App.urls.get("bodega:guardar_factura");
        this.guia.garantias = this.garantias;
        json = this.guia.getJSON();

        this.http.post(action, json).success(function(data){
            $("#modal_carga_producto").modal("hide");
            common.agregarMensaje("La guía ha sido guardada exitosamente");
        });
    },

    esPaso: function(numeroPaso){
        return this.paso === numeroPaso;
    }
});

module.exports = GuiaProductoController;

},{"./bodega_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/transito_controller.js":[function(require,module,exports){
function TransitoController($http){
    this.resultados = null;
    this.http = $http;
}

TransitoController.prototype = {
    constructor: TransitoController,

    verDetalle: function(id){
        var action = App.urls.get("bodega:obtener_vehiculos_por_producto"),
            _this = this;

        action += "?producto_id=" + id;

        this.http.get(action).success(function(data){
            _this.resultados = data;
            $("#modal_ver_detalle").modal("show");
        });
    }
};

module.exports = TransitoController;

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bodega_bundle.js"]);
