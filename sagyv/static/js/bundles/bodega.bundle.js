(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/bodega_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('bodegaApp', [], App.httpProvider),
    BodegaController = require('../controllers/bodega/bodega_controller.js'),
    GuiaController = require('../controllers/bodega/guia_controller.js'),
    TransitoController = require('../controllers/bodega/transito_controller.js'),
    GuiaProductoController = require('../controllers/bodega/guia_producto_controller.js'),
    bodegaService = require('../services/bodega_service.js');

app.factory('bodegaService', bodegaService);

app.controller('BodegaController', ['$rootScope', 'bodegaService', BodegaController]);
app.controller('GuiaController', ['$rootScope','bodegaService', GuiaController]);
app.controller('TransitoController', ['$rootScope', 'bodegaService', TransitoController]);
app.controller('GuiaProductoController', ['$rootScope', 'bodegaService', GuiaProductoController]);

})();

},{"../controllers/bodega/bodega_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js","../controllers/bodega/guia_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_controller.js","../controllers/bodega/guia_producto_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_producto_controller.js","../controllers/bodega/transito_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/transito_controller.js","../services/bodega_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/bodega_service.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js":[function(require,module,exports){
var Guia = require('../../models/bodega/guia_model.js');

function BodegaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.guia = new Guia();
    this.productosBodega = [];

    this.producto = {};
    this.numeroGuia = null;
    this.addListeners();

    if(arguments.length <= 2){
        this.obtenerProductos();
    }
};

BodegaController.mixin({
    addListeners: function(){
        this.scope.$on('bodega/recargaProductos', this.obtenerProductos.bind(this));
    },

    obtenerProductos: function(){
        var _this = this;

        this.service.findProductos(function(productos){
            _this.productosBodega = productos;
        });
    },

    nuevaGuiaDespacho: function(){
        this.guia = new Guia();
        this.guia.numero = this.numeroGuia;
        this.producto = {};

        var _this = this;

        this.refrescarNumeroGuia(function(){
            $('#modal_guia_despacho').modal('show');
        });
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
        this.obtenerProductos();
        this.scope.$broadcast('guia/recargarTransito');
        this.scope.$broadcast('guia/recargarGuia');

        $('#modal_guia_despacho').modal('hide');
        common.agregarMensaje('Se ha actualizado el vehiculo exitosamente');
    },

    refrescarNumeroGuia: function(callback){
        var _this = this;

        this.service.findNumeroGuia(function(data){
            _this.numeroGuia = data.next;
            _this.guia.numero = _this.numeroGuia;

            if(typeof callback === 'function'){
                callback();
            }
        });
    }
});

module.exports = BodegaController;

},{"../../models/bodega/guia_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/guia_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_controller.js":[function(require,module,exports){
var Recarga = require('../../models/bodega/recarga_model.js');

function GuiaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.recarga = new Recarga();
    this.productos = [];
    this.producto = {};
    this.fecha = null;
    this.guias = [];

    this.filtrarGuias();
    this.addListeners();
}

GuiaController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarGuia', this.filtrarGuias.bind(this));
    },

    filtrarGuias: function(){
        var fecha = null,
            _this = this;

        if(this.fecha){
            fecha = common.fecha.fechaToJSON(this.fecha);
        }

        this.service.filtrarPorFecha({ fecha: fecha },function(data){
            _this.guias = data.guias.map(function(guia){
                guia.fecha = common.fecha.jsonToDate(guia.fecha);
                return guia;
            });
        });
    },

    verGuia: function(id){
        var _this = this;

        this.service.obtenerGuia({guia_id: id}, function(data){
            _this.productos = data.productos;
            $('#modal_mostrar_guia').modal('show');
        });
    },

    recargarGuia: function(id){
        this.recarga = new Recarga();
        this.service.obtenerGuia({guia_id: id}, this.procesarMostrarRecarga.bind(this, id));
    },

    procesarMostrarRecarga: function(id, data){
        this.recarga.id = id;
        this.recarga.numero = data.numero_guia;
        this.recarga.vehiculo = data.movil;
        this.recarga.fecha = common.fecha.agregarCeros(data.fecha);
        this.recarga.productos = data.productos;

        $('#modal_recargar_guia').modal('show');
    },

    agregarRecarga: function(idSelect){
        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
            this.producto.codigo = $('#' + idSelect + ' option:selected').text();
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
            $('#stock_' + producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
        });

        $('#modal_recargar_guia').modal('hide');
        common.agregarMensaje('Se ha actualizado el vehiculo exitosamente');
    }
});

module.exports = GuiaController;

},{"../../models/bodega/recarga_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/recarga_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/guia_producto_controller.js":[function(require,module,exports){
var BodegaController = require('./bodega_controller.js'),
    Factura = require('../../models/bodega/factura_model.js');

function GuiaProductoController($scope, service){
    BodegaController.call(this, $scope, service, false);
    this.guia = new Factura();
    this.paso = 1;
    this.garantias = null;
    this.valorCalculado = 0;
    this.producto = {};
    this.versionAnterior = null;
}

GuiaProductoController.mixin(BodegaController,{
    nuevaFactura: function(){
        this.guia = new Factura();
        this.producto = {}
        this.paso = 1;
        this.valorCalculado = 0;

        $('#modal_carga_producto').modal('show');
    },

    agregarProducto: function(idSelect){
        var select;

        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
            select = $('#' + idSelect + ' option:selected');
            this.producto.codigo = select.text();
            this.producto.precio = select.data('precio') * this.producto.cantidad;
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

        garantias = { '3105': 0, '3111': 0, '3115': 0, '3145': 0 };

        this.guia.productos.forEach(function(producto){
            var codigo = producto.codigo.split('').slice(2).join('');

            if(('31' + codigo) in garantias){
                garantias['31' + codigo] += parseInt(producto.cantidad);
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
        var json, _this = this;

        this.guia.garantias = this.garantias;
        json = this.guia.getJSON();

        this.service.guardarFactura(json, function(data){
            _this.scope.$emit('bodega/recargaProductos');
            $('#modal_carga_producto').modal('hide');
            common.agregarMensaje('La guía ha sido guardada exitosamente');
        });
    },

    esPaso: function(numeroPaso){
        return this.paso === numeroPaso;
    }
});

module.exports = GuiaProductoController;

},{"../../models/bodega/factura_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/factura_model.js","./bodega_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/bodega_controller.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/bodega/transito_controller.js":[function(require,module,exports){
function TransitoController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.resultados = null;
    this.productosTransito = [];

    this.recargarTransito();
    this.addListeners();
}

TransitoController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarTransito', this.recargarTransito.bind(this));
    },

    recargarTransito: function(){
        var self = this;

        this.service.findProductosTransito(function(productosTransito){
            self.productosTransito = productosTransito;
        });
    },

    verDetalle: function(id){
        var _this = this;

        this.service.findVehiculoByProducto(id, function(data){
            _this.resultados = data;
            $('#modal_ver_detalle').modal('show');
        });
    }
});

module.exports = TransitoController;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/factura_model.js":[function(require,module,exports){
function Factura(){
    this.id = null;
    this.factura = null;
    this.valor = null;
    this.fecha = new Date();
    this.productos = [];
    this.garantias = null;

    this.mensajes = {};
};

Factura.mixin({
    esValida: function(){
        var valido = true;

        valido = this.esFacturaValida() && valido;
        valido = this.esValorValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductoValid() && valido;

        return valido;
    },

    agregarProducto: function(producto){
        var fn,
            valido = true;

        fn = function(p){
            return p.codigo === producto.codigo && p.id === producto.id && p.precio === producto.precio;
        };

        this.mensajes.producto = "";

        if(!producto.id || !producto.codigo || !producto.cantidad){
            valido = false;
            this.mensajes.producto = "El producto debe ingresarse tanto el código como la cantidad";
        }else if(_.find(this.productos, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
        }else{
            this.productos.push(producto);
        }

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    _esFechaValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!type.isDate(this[campo])){
            valido = false;
            this.mensajes[campo] = "fecha inválida";
        }

        return valido;
    },

    esFacturaValida: function(){
        return this._esNumeroValido('factura');
    },

    esValorValido: function(){
        return this._esNumeroValido('valor');
    },

    esFechaValida: function(){
        return this._esFechaValida('fecha');
    },

    esProductoValid: function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    getJSON: function(){
        var json = {
            factura: this.factura,
            valor: this.valor,
            fecha: common.fecha.fechaToJSON(this.fecha),
            productos: JSON.stringify(this.productos),
            garantias: JSON.stringify(this.garantias),
            observaciones: this.observaciones
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
});

module.exports = Factura;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/guia_model.js":[function(require,module,exports){
function Guia(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.fecha = new Date();
    this.productos = []; //siempre debe comenzar con una nueva lista de productos
    this.observaciones = null;
    this.estado = null;

    this.mensajes = {};
};

Guia.mixin({
    agregarProductoDescuento: function(producto){
        var fn,
            valido = true;

        fn = function(p){
            return p.codigo === producto.codigo && p.id === producto.id;
        };

        this.mensajes.producto = "";

        if(!producto.id || !producto.codigo || !producto.cantidad){
            valido = false;
            this.mensajes.producto = "El producto debe ingresarse tanto el código como la cantidad";
        }else if(_.find(this.productos, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
        }else if(parseInt(App.productos[producto.id]) < parseInt(producto.cantidad)){
            valido = false;
            this.mensajes.producto = "No se pueden agregar mas productos de los que hay en stock";
        }else{
            this.productos.push(producto);
        }

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    _esFechaValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!type.isDate(this[campo])){
            valido = false;
            this.mensajes[campo] = "fecha inválida";
        }

        return valido;
    },

    esNumeroValido: function(){
        return this._esNumeroValido('numero');
    },

    esVehiculoValido:function(){
        return this._esNumeroValido('vehiculo');
    },

    esFechaValida:function(){
        return this._esFechaValida('fecha');
    },

    esProductosValido:function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    esValida: function(){
        var valido = true;

        valido = this.esNumeroValido() && valido;
        valido = this.esVehiculoValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductosValido() && valido;

        return valido;
    },

    getJSON: function(){
        var json = {
            numero: this.numero,
            factura: this.factura,
            vehiculo: this.vehiculo,
            fecha: common.fecha.fechaToJSON(this.fecha),
            productos: JSON.stringify(this.productos)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
});

module.exports = Guia;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/bodega/recarga_model.js":[function(require,module,exports){
function Recarga(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.fecha = new Date().toLocaleString();
    this.productos = [];
    this.productos_recarga = [];
    this.monto = 0;
    this.observaciones = null;

    this.mensajes = {};
};

Recarga.mixin({
    agregarProductoDescuento: function(producto){
        var fn,
            valido = true;

        fn = function(p){
            return p.codigo === producto.codigo && p.id === producto.id;
        };

        this.mensajes.producto = "";

        if(!producto.id || !producto.codigo || !producto.cantidad){
            valido = false;
            this.mensajes.producto = "El producto debe ingresarse tanto el código como la cantidad";
        }else if(_.find(this.productos_recarga, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
        }else if(parseInt(App.productos[producto.id]) < parseInt(producto.cantidad)){
            valido = false;
            this.mensajes.producto = "No se pueden agregar mas productos de los que hay en stock";
        }else{
            this.productos_recarga.push(producto);
        }
        return valido;
    },

    esMontoValido: function(){
        var valido = true;

        if(this.monto){
            this.mensajes.monto = '';
            if(isNaN(this.monto)){
                valido = false;
                this.mensajes.monto = "el valor debe ser numérico";
            }else if(parseInt(this.monto) < 0){
                valido = false;
                this.mensajes.monto = "el valor debe ser positivo";
            }
        }else{
            this.monto = 0;
        }

        return valido;
    },

    esProductosValido:function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos_recarga.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    esValida: function(){
        var valido = true;
        valido = this.esProductosValido() && valido;
        valido = this.esMontoValido() && valido;

        return valido;
    },

    getJSON: function(){
        var json = {
            id_guia: this.id,
            monto: this.monto,
            productos: JSON.stringify(this.productos_recarga)
        }

        return json;
    }
});

module.exports = Recarga;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/bodega_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services, get, post, noop;

    noop = function(){};

    get = function(url, callback){
        $http.get(url).success(callback || noop).error(serviceUtil.standardError);
    };

    post = function(url, params, callback){
        $http.post(url, params).success(callback || noop).error(serviceUtil.standardError);
    };

    services = {
        findProductos: function(callback){
            var url = App.urls.get('bodega:obtener_productos');
            get(url, callback);
        },

        findProductosTransito:function(callback){
            var url = App.urls.get('bodega:obtener_productos_transito');
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
            post(url, params, callback);
        },

        findNumeroGuia: function(callback){
            var url = App.urls.get('bodega:obtener_id_guia');
            get(url, callback);
        },

        findVehiculoByProducto: function(id, callback){
            var url = App.urls.get('bodega:obtener_vehiculos_por_producto');
            url += '?producto_id=' + id;

            get(url, callback);
        }
    };

    return services;
}

module.exports = BodegaService;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}]},{},["/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/bodega_bundle.js"]);
