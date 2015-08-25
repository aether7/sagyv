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
    this.index = null;
    this.anios = [];
    this.meses = [];
    this.dias = [];

    this.init();
}

VehiculoController.prototype = {
    constructor: VehiculoController,

    init: function(){
        var anio, mes, dia;

        for(anio = 2000; anio <= 2020; anio++){
            this.anios.push(anio);
        }

        for(mes = 1; mes <= 12; mes++){
            this.meses.push(mes < 10 ? '0' + mes : mes);
        }

        for(dia = 1; dia <= 31; dia++){
            this.dias.push(dia < 10 ? '0' + dia : dia);
        }

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
        this.vehiculo.estadoSec = 0;
        this.vehiculo.estadoPago = 0;
    },

    mostrarAnexar: function(index){
        this.index = index;

        $("#modal_anexar").modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    mostrarEditar: function(index){
        this.index = index;

        $('#modal_editar').modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    crearVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        if(!this.validarNumeroPatente()){
            return;
        }

        if(this.vehiculo.chofer.id){
            this.vehiculo.chofer.nombre = $('#chofer_vehiculo_nuevo option:selected').text();
        }

        var json = this.vehiculo.toJSON();
        this.service.crearVehiculo(json, this.processAgregarVehiculo.bind(this));
    },

    validarNumeroPatente: function(){
        var self = this,
            preexistencia = true;

        this.vehiculo.mensaje.numero = null;
        this.vehiculo.mensaje.patente = null;

        this.vehiculos.forEach(function(v){
            if(v.chofer.id == self.vehiculo.chofer.id){
                v.chofer.id = null;
                v.chofer.nombre = "No anexado";
            }

            if(v.numero == self.vehiculo.numero){
                self.vehiculo.mensaje.numero = "La numeración ya existe";
                preexistencia = false;
            }else if(v.patente.toUpperCase() == self.vehiculo.patente.toUpperCase()){
                self.vehiculo.mensaje.patente = "La patente ya existe";
                preexistencia = false;
            }
        });

        return preexistencia;
    },

    actualizarVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        this.service.actualizarVehiculo(json, this.procesarEditarVehiculo.bind(this));
    },

    processAgregarVehiculo: function(data){
        this.vehiculos.push(this.vehiculo);
        this.vehiculo = null;

        $('#modal_nuevo_vehiculo').modal('hide');
        common.agregarMensaje('El vehículo fue creado exitosamente');
    },

    procesarEditarVehiculo: function(data){
        this.vehiculos[this.index] = this.vehiculo;

        $('#modal_editar').modal('hide');
        common.agregarMensaje('El vehículo fue actualizado exitosamente');
    },

    anexarChofer: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        this.vehiculo.chofer.nombre = $('#anexar_chofer option:selected').text();

        var json = this.vehiculo.toJSON();
        this.service.anexarChofer(json, this.processAnexarChofer.bind(this));
    },

    processAnexarChofer: function(data){
        this.vehiculos[this.index] = this.vehiculo;

        $("#modal_anexar").modal('hide');
        common.agregarMensaje('El vehículo fue anexado con trabajador exitosamente');
    },

};

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
    this.chofer = {};

    this.mensaje = {};
}

Vehiculo.prototype = {
    constructor: Vehiculo,

    addData: function(data){
        this.id = data.id;
        this.numero = data.movil.numero;
        this.patente = data.patente;
        this.kilometraje = data.km;
        this.fechaRevision = common.fecha.jsonToDate(data.fechaRevisionTecnica);
        this.estadoSec = data.estadoSec;
        this.estadoPago = data.estadoPago;
        this.chofer = data.chofer;
    },

    esValido: function(){
        var valido = true;
        this.mensaje = {};

        valido = this.esNumeroValido() && valido;
        valido = this.esPatenteValida() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esKilometrajeValido() && valido;

        return valido;
    },

    esNumeroValido: function(){
        if(!this.numero || isNaN(this.numero)){
            this.mensaje.numero = 'Campo inválido';
            return false;
        }else if(parseInt(this.numero) < 1){
            this.mensaje.numero = 'Ingrese numero mayor a 0';
            return false;
        }

        return true;
    },

    esPatenteValida: function(){
        var formato1 = /^[A-z]{4}\d{2}$/,
            formato2 = /^[A-z]{2}\d{4}$/;

        if(!formato1.test(this.patente) && !formato2.test(this.patente)){
            this.mensaje.patente = 'Patente inválida';
            return false;
        }

        return true;
    },

    esFechaValida: function(){
        if(!this.fechaRevision){
            this.mensaje.fechaRevision = 'Fecha obligatoria';
            return false;
        }

        return true;
    },

    esKilometrajeValido: function(){
        if(isNaN(this.kilometraje)){
            this.mensaje.kilometraje = 'Campo inválido';
            return false;
        }else if(parseInt(this.kilometraje) < 0){
            this.mensaje.kilometraje = 'Ingrese numero mayor o igual a 0';
            return false;
        }

        return true;
    },

    getNombreChofer: function(){
        if(this.chofer.id){
            return this.chofer.nombre;
        }else{
            return 'No anexado';
        }
    },

    toJSON: function(){
        var json = {
            numero: this.numero,
            patente: this.patente,
            kilometraje: this.kilometraje,
            fechaRevisionTecnica: common.fecha.fechaToJSON(this.fechaRevision),
            estadoSec: this.estadoSec,
            estadoPago: this.estadoPago
        };

        if(this.chofer.id){
            json.chofer = JSON.stringify(this.chofer);
        }else{
            json.chofer = JSON.stringify({ id: 0, nombre: '' });
        }

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

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
        },

        actualizarVehiculo: function(data, callback){
            var url = App.urls.get('vehiculos:modificar');
            post(url, data, callback);
        },

        anexarChofer: function(data, callback){
            var url = App.urls.get('vehiculos:anexar');
            post(url, data, callback);
        }
    };

    return service;
}

module.exports = vehiculoService;

},{"./service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/vehiculo_bundle.js"]);
