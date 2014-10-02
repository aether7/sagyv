(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/bodega_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('bodegaApp', [], App.httpProvider),
    BodegaController = require('../controllers/bodega/bodega_controller.js'),
    GuiaController = require('../controllers/bodega/guia_controller.js'),
    TransitoController = require('../controllers/bodega/transito_controller.js'),
    GuiaProductoController = require('../controllers/bodega/guia_producto_controller.js'),
    bodegaService = require('../services/bodega_service.js');

app.factory('bodegaService', bodegaService);

app.controller('BodegaController', ['$http', 'bodegaService', BodegaController]);
app.controller('GuiaController', ['$scope','bodegaService', GuiaController]);
app.controller('TransitoController', ['$http', TransitoController]);
app.controller('GuiaProductoController', ['$http', 'bodegaService', GuiaProductoController]);

})();

},{"../controllers/bodega/bodega_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js","../controllers/bodega/guia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_controller.js","../controllers/bodega/guia_producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_producto_controller.js","../controllers/bodega/transito_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/transito_controller.js","../services/bodega_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/bodega_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js":[function(require,module,exports){
function BodegaController($http, service, stop){
    this.service = service;
    this.guia = new App.Models.Guia();
    this.productosBodega = [];

    this.producto = {};
    this.http = $http;
    this.numeroGuia = null;

    if(!stop){
        this.refrescarNumeroGuia();
    }

    this.addListeners();
    this.obtenerProductos();
};

BodegaController.mixin({
    addListeners: function(){

    },

    obtenerProductos: function(){
        var _this = this;

        this.service.findProductos(function(productos){
            _this.productosBodega = productos;
        });
    },

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
        var json, valido = this.guia.esValida();

        if(!valido){
            return;
        }

        json = this.guia.getJSON();
        this.service.crearGuia(json, this.procesarGuardarGuiaDespacho.bind(this));
    },

    guardarFactura: function(){
        var json, valido = this.factura.esValida();

        if(!valido){
            return;
        }

        json = this.factura.getJSON();
        this.service.guardarFactura(json, function(data){
            alert('no está implementado');
        });
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
        var _this = this;

        this.service.findNumeroGuia(function(data){
            _this.numeroGuia = data.next;

            setTimeout(function(){
                _this.refrescarNumeroGuia();
            }, 60000);
        });
    }
});

module.exports = BodegaController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_controller.js":[function(require,module,exports){
function GuiaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.recarga = new App.Models.Recarga();
    this.productos = [];
    this.producto = {};
    this.fecha = null;
    this.guias = [];

    this.filtrarGuias();
}

GuiaController.mixin({
    filtrarGuias: function(){
        var fecha = null,
            _this = this;

        if(this.fecha){
            fecha = common.fecha.fechaToJSON(this.fecha);
        }

        this.service.filtrarPorFecha({ fecha: fecha },function(data){
            _this.guias = data.guias;
        });
    },

    verGuia: function(id){
        var _this = this;

        this.service.obtenerGuia({guia_id: id}, function(data){
            _this.productos = data.productos;
            $("#modal_mostrar_guia").modal("show");
        });
    },

    recargarGuia: function(id){
        this.recarga = new App.Models.Recarga();
        this.service.obtenerGuia({guia_id: id}, this.procesarMostrarRecarga.bind(this, id));
    },

    procesarMostrarRecarga: function(id, data){
        this.recarga.id = id;
        this.recarga.numero = data.numero_guia;
        this.recarga.vehiculo = data.movil;
        this.recarga.fecha = common.fecha.agregarCeros(data.fecha);
        this.recarga.productos = data.productos;

        $("#modal_recargar_guia").modal("show");
    },

    agregarRecarga: function(idSelect){
        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.recarga.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        this.recarga.productos_recarga.splice(indice, 1);
    },

    guardarRecarga: function(){
        if(!this.recarga.esValida()){
            return;
        }

        var json = this.recarga.getJSON();
        this.service.guardarRecarga(json, this.procesarRecarga.bind(this));
    },

    procesarRecarga: function(data){
        data.productos.forEach(function(producto){
            $("#stock_"+producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
        });

        $("#modal_recargar_guia").modal("hide");
        common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
    }
});

module.exports = GuiaController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_producto_controller.js":[function(require,module,exports){
var BodegaController = require("./bodega_controller.js");

function GuiaProductoController($http, service){
    BodegaController.call(this, $http, service, true);
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

        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
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
        var nuevoHash = JSON.stringify(this.garantias.map(function(garantia){
            return { codigo: garantia.codigo, cantidad: garantia.cantidad };
        }));

        if(this.versionAnterior !== nuevoHash){
            this.paso = 3;
            return;
        }

        this.procesarGuardado();
    },

    guardarPaso3: function(){
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
            data.guia.productos.forEach(function(producto){
                var cantidad,
                    stock = $("#stock_" + producto.id);

                cantidad = parseInt(stock.text(), 10);
                stock.text(cantidad);
            });

            $("#modal_carga_producto").modal("hide");
            common.agregarMensaje("La guía ha sido guardada exitosamente");
        });
    },

    esPaso: function(numeroPaso){
        return this.paso === numeroPaso;
    }
});

module.exports = GuiaProductoController;

},{"./bodega_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/bodega/transito_controller.js":[function(require,module,exports){
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/bodega_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services, get, post;

    get = function(url, callback){
        $http.get(url).success(callback).error(serviceUtil.standardError);
    };

    post = function(url, params, callback){
        $http.post(url, params).success(callback).error(serviceUtil.standardError);
    };

    services = {
        findProductos: function(callback){
            var url = App.urls.get('bodega:obtener_productos');
            get(url, callback);
        },

        obtenerGuia: function(params, callback){
            var url = App.urls.get('bodega:obtener_guia');
            url = serviceUtil.processURL(url, params);
            get(url, callback);
        },

        filtrarPorFecha: function(params, callback){
            var url = App.urls.get('bodega:filtrar_guias');
            url = serviceUtil.processURL(url, params);

            get(url, callback);
        },

        guardarRecarga: function(params, callback){
            var url = App.urls.get('bodega:recargar_guia');
            post(url, params, callback);
        },

        crearGuia: function(params, callback){
            var url = App.urls.get('bodega:crea_guia');
            post(url, params, callback);
        },

        guardarFactura: function(params, callback){
            var url = App.urls.get('bodega:guardar_factura');
            post(params, callback);
        },

        findNumeroGuia: function(callback){
            var url = App.urls.get('bodega:obtener_id_guia');
            get(url, callback);
        }
    };

    return services;
}

module.exports = BodegaService;

},{"./service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
function standardError(data){
    alert('ha ocurrido un error en el servidor !!!');
};

function processURL(url, params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    url += '?' + queryStr.join('&');
    return url;
};

exports.standardError = standardError;
exports.processURL = processURL;

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/bodega_bundle.js"]);
