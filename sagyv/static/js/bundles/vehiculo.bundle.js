(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/vehiculo_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('vehiculoApp', [], App.httpProvider),
    VehiculoController = require('../controllers/vehiculo/vehiculo_controller.js'),
    vehiculoService = require('../services/vehiculo_service.js');

app.factory('vehiculoService', vehiculoService);
app.controller('VehiculoController', ['vehiculoService', VehiculoController]);

})();

},{"../controllers/vehiculo/vehiculo_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/vehiculo/vehiculo_controller.js","../services/vehiculo_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/vehiculo_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/vehiculo/vehiculo_controller.js":[function(require,module,exports){
var Vehiculo = require('../../models/vehiculo/vehiculo_model.js');

function VehiculoController(service){
    this.service = service;
    this.vehiculos = [];
    this.vehiculo = null;

    this.init();
}

VehiculoController.mixin({
    init: function(){
        this.service.findAll(this.cargarLista.bind(this));
    },

    cargarLista: function(data){
        var _this = this;

        data.forEach(function(obj){
            var vehiculo = new Vehiculo();

            vehiculo.addData(obj);
            _this.vehiculos.push(vehiculo);
        });
    },

    mostrarNuevo: function(){
        $('#modal_nuevo_vehiculo').modal('show');
        this.vehiculo = new Vehiculo();
    },

    crearVehiculo: function(){
        console.log(this.vehiculo);
        console.log(this.vehiculo.toJSON());

        return;
        this.vehiculos.push(this.vehiculo);
        $('#modal_nuevo_vehiculo').modal('hide');
        common.agregarMensaje('El vehículo fue creado exitosamente');
    }
});

module.exports = VehiculoController;

},{"../../models/vehiculo/vehiculo_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/vehiculo/vehiculo_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/vehiculo/vehiculo_model.js":[function(require,module,exports){
function Vehiculo(){
    this.id = null;
    this.numero = null;
    this.patente = null;
    this.kilometraje = 0;
    this.fechaRevision = null;
    this.estadoSec = null;
    this.estadoPago = null;
    this.chofer = null;
}

Vehiculo.mixin({
    addData: function(data){
        this.id = data.id;
        this.numero = data.numero;
        this.patente = data.patente;
        this.kilometraje = data.km;
        this.fechaRevision = data.fechaRevisionTecnica;
        this.estadoSec = data.estadoSec;
        this.estadoPago = data.estadoPago;
        this.chofer = data.chofer;
    },

    toJSON: function(){
        var json = {
            numero: this.numero,
            patente: this.patente,
            kilometraje: this.kilometraje,
            fechaRevisionTecnica: common.fecha.fechaToJSON(this.fechaRevision),
            estadoSec: this.estadoSec,
            estadoPago: this.estadoPago,
            chofer: this.chofer
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
});

module.exports = Vehiculo;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
function noop(){}

function standardError(data){
    alert('ha ocurrido un error en el servidor !!!, por favor informe al administrador');
};

function processURL(url, params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    url += '?' + queryStr.join('&');
    return url;
};

function URLMaker(){
    this.url = null;
}

URLMaker.prototype.withThis = function(url){
    this.url = url;
    return this;
};

URLMaker.prototype.doQuery = function(params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    this.url += '?' + queryStr.join('&');
    return this.url;
};

exports.standardError = standardError;
exports.processURL = processURL;
exports.URLMaker = URLMaker;

exports.getMaker = function($http){
    return function(){
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            url = args.shift();

        if(args.length){
            url = new URLMaker().withThis(url).doQuery(args[0]);
        }

        $http.get(url).success(callback || noop).error(standardError);
    };
};

exports.postMaker = function($http){
    return function(url, params, callback){
        $http.post(url, params).success(callback || noop).error(standardError);
    };
};

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/vehiculo_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function vehiculoService($http){
    var get, post, service;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    service = {
        findAll: function(callback){
            var url = App.urls.get('vehiculos:obtener_vehiculos');
            get(url, callback);
        },

        crearVehiculo: function(data, callback){
            var url = App.urls.get('vehiculos:nuevo');
            post(url, data, callback);
        }
    };

    return service;
}

module.exports = vehiculoService;

},{"./service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/vehiculo_bundle.js"]);
