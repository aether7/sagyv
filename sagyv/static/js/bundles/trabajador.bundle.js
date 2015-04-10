(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/trabajador_bundle.js":[function(require,module,exports){
(function(){
'use strict';
var app = angular.module('trabajadorApp', [], App.httpProvider),
    trabajadorService = require('../services/trabajador_service.js'),
    TrabajadorController = require('../controllers/trabajador/trabajador_controller.js');

app.factory('trabajadorService',['$http', trabajadorService]);
app.controller('TrabajadorController',['trabajadorService', TrabajadorController]);

})();

},{"../controllers/trabajador/trabajador_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/trabajador/trabajador_controller.js","../services/trabajador_service.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/trabajador_service.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/trabajador/trabajador_controller.js":[function(require,module,exports){
var Trabajador = require('../../models/trabajador/trabajador_model.js'),
    Boleta = require('../../models/trabajador/boleta_model.js');

function TrabajadorController(service){
    this.service = service;
    this.trabajadores = [];
    this.trabajador = new Trabajador();
    this.boleta = new Boleta();
    this.index = null;

    this.init();
}

TrabajadorController.prototype = {
    constructor: TrabajadorController,

    init: function(){
        var _this = this;

        this.service.findAll(function(data){
            _this.trabajadores = data.map(function(obj){
                var trabajador = new Trabajador();

                trabajador.id = obj.id;
                trabajador.nombre = obj.nombre;
                trabajador.apellido = obj.apellido;
                trabajador.rut = obj.rut;
                trabajador.domicilio = obj.domicilio;
                trabajador.fechaNacimiento = common.fecha.jsonToDate(obj.nacimiento);
                trabajador.inicioContrato = common.fecha.jsonToDate(obj.fechaInicioContrato);
                trabajador.vigenciaLicencia = common.fecha.jsonToDate(obj.vigenciaLicencia);
                trabajador.afp = obj.afp;
                trabajador.sistemaSalud = obj.sistemaSalud;
                trabajador.estadoCivil = obj.estadoCivil;
                trabajador.estadoVacacion = obj.estadoVacacion;
                trabajador.tipo = obj.tipo;

                return trabajador;
            });
        });
    },

    mostrar: function(){
        this.trabajador = new Trabajador();
        common.mostrarModal('nuevo');
    },

    crearTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        if(this.existeTrabajador(this.trabajador)){
            this.trabajador.mensajes.rut = 'El rut está siendo utilizado por otro trabajador';
            return;
        }

        var json = this.trabajador.getJSON();
        this.service.crear(json, this.renderNuevoTrabajador.bind(this));
    },

    existeTrabajador: function(trabajador){
        var resultado = this.trabajadores.filter(function(t){
            return t.rut === trabajador.rut;
        });

        return resultado.length;
    },

    renderNuevoTrabajador: function(data){
        this.trabajador.id = data.id;
        this.trabajador.estadoVacacion = data.estadoVacacion;
        this.trabajador.estadoCivil = data.estadoCivil;
        this.trabajador.afp = data.afp;
        this.trabajador.sistemaSalud = data.sistemaSalud;

        this.trabajadores.push(this.trabajador);

        $('#modal_nuevo').modal('hide');
        common.agregarMensaje('El trabajador ha sido creado exitosamente');
    },

    verTrabajador: function(index){
        var _this = this;
        this.trabajador = this.trabajadores[index];

        this.service.obtener(this.trabajador.id, function(data){
            _this.trabajador.boleta.boletaInicial = data.boleta.boletaInicial
            _this.trabajador.boleta.boletaActual = data.boleta.boletaActual
            _this.trabajador.boleta.boletaFinal = data.boleta.boletaFinal
            common.mostrarModal('ver');
        });
    },

    editarTrabajador: function(index){
        var _this = this,
            trabajador = this.trabajadores[index];

        this.index = index;
        this.trabajador = trabajador;
        common.mostrarModal('editar');
    },

    actualizarTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        this.service.actualizar(this.trabajador.getJSON(), this.renderActualizarTrabajador.bind(this));
    },

    renderActualizarTrabajador: function(data){
        $('#modal_editar').modal('hide');
        common.agregarMensaje('El trabajador ha sido editado exitosamente');
    },

    eliminarTrabajador: function(index){
        if(!confirm('¿Esta seguro(a) de realizar esta acción ?')){
            return;
        }

        var trabajador = this.trabajadores[index],
            id = trabajador.id,
            _this = this;

        this.service.eliminar(id, function(data){
            _this.trabajadores.splice(index, 1);
            common.agregarMensaje('El trabajador se ha eliminado exitosamente');
        });
    },

    anexarBoleta: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.boleta = new Boleta();

        this.service.buscarBoleta(id, function(data){
            _this.boleta.numeroAnterior = data.boletaActual;
            _this.boleta.boletaInicial = data.boletaFinal + 1;
            _this.boleta.boletaFinal = data.boletaFinal + 2;
            _this.boleta.id = id;

            $('#modal_anexar_boleta').modal('show');
        });
    },

    guardarTalonario: function(){
        if(!this.boleta.esValida()){
            return;
        }

        var json = this.boleta.getJSON();

        this.service.guardarBoleta(json, function(data){
            $('#modal_anexar_boleta').modal('hide');
            common.agregarMensaje('Se ha anexado el talonario de boletas al trabajador exitosamente');
        });
    }
};

module.exports = TrabajadorController;

},{"../../models/trabajador/boleta_model.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/models/trabajador/boleta_model.js","../../models/trabajador/trabajador_model.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/models/trabajador/trabajador_model.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/models/trabajador/boleta_model.js":[function(require,module,exports){
function Boleta(){
    this.numeroAnterior = 0;
    this.boletaInicial = 1;
    this.boletaFinal = 0;
    this.id = null;

    this.mensajes = {};
};

Boleta.mixin({
    esValidaBoletaInicial: function(){
        var valido = true;

        if(isNaN(this.boletaInicial)){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta es inválido';
        }else if(this.boletaInicial >= this.boletaFinal){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta inicial debe ser menor a la boleta final';
        }else if(this.boletaInicial < 1){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta mínimo es 1';
        }else if(this.boletaInicial <= this.numeroAnterior){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta inicial debe ser mayor a la boleta actual';
        }

        return valido;
    },

    esValidaBoletaFinal: function(){
        var valido = true;

        if(isNaN(this.boletaFinal)){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta es inválido';
        }else if(this.boletaFinal <= this.boletaInicial){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta final debe ser menor a la boleta inicial';
        }else if(this.boletaFinal < 1){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta mínimo es 1';
        }

        return valido;
    },

    esValida: function(){
        var valida = true;

        valida = this.esValidaBoletaInicial() && valida;
        valida = this.esValidaBoletaFinal() && valida;

        return valida;
    },

    getJSON: function(){
        var json = {
            boletaInicial: this.boletaInicial,
            boletaFinal: this.boletaFinal,
            id: this.id
        };

        return json;
    }
});

module.exports = Boleta;

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/models/trabajador/trabajador_model.js":[function(require,module,exports){
var constantes = {
    CHOFER: 1,
    FLETERO : 2
};

var Trabajador = function(){
    this.id = null;
    this.nombre = null;
    this.apellido = null;
    this.rut = null;
    this.domicilio = null;
    this.fechaNacimiento = null;
    this.inicioContrato = null;
    this.vigenciaLicencia = null;
    this.tipo = { id: 1, nombre: 'Chofer' };
    this.afp = {id: null, nombre: null};
    this.sistemaSalud = {id: null, nombre: null};
    this.estadoCivil = {id: null, nombre: null};
    this.estadoVacacion = {id: null, nombre: null};
    this.boleta = {};

    this.mensajes = {};
};

Trabajador.prototype = {
    constructor: Trabajador,

    esChofer: function(){
        return parseInt(this.tipo.id) === constantes.CHOFER;
    },

    esNombreValido: function(){
        return this._esTextoValido('nombre', 'El nombre no es válido');
    },

    esApellidoValido: function(){
        return this._esTextoValido('apellido', 'El apellido no es válido');
    },

    esRutValido: function(){
        var valido = true;

        this.mensajes.rut = '';

        if(!this.rut){
            valido = false;
            this.mensajes.rut = 'campo obligatorio';
        }else if(!$.Rut.validar(this.rut)){
            valido = false;
            this.mensajes.rut = 'RUT no válido';
        }

        return valido;
    },

    esDomicilioValido: function(){
        var valido = true;

        this.mensajes.domicilio = '';

        if(!this.domicilio){
            valido = false;
            this.mensajes.domicilio = 'campo obligatorio';
        }

        return valido;
    },

    esFechaNacimientoValida: function(){
        return this._esFechaValida('fechaNacimiento');
    },

    esInicioContratoValido: function(){
        return this._esFechaValida('inicioContrato');
    },

    esVigenciaLicenciaValida: function(){
        return this._esFechaValida('vigenciaLicencia');
    },

    esAfpValida: function(){
        return this._esSeleccionValida('afp');
    },

    esSistemaSaludValido: function(){
        return this._esSeleccionValida('sistemaSalud');
    },

    esEstadoCivilValido: function(){
        return this._esSeleccionValida('estadoCivil');
    },

    esEstadoVacacionValido: function(){
        return this._esSeleccionValida('estadoVacacion');
    },

    esTipoValido: function(){
        return this._esSeleccionValida('tipo');
    },

    esValido: function(){
        var valido = true;

        valido = this.esNombreValido() && valido;
        valido = this.esApellidoValido() && valido;
        valido = this.esRutValido() && valido;
        valido = this.esDomicilioValido() && valido;
        valido = this.esFechaNacimientoValida() && valido;
        valido = this.esInicioContratoValido() && valido;
        valido = this.esVigenciaLicenciaValida() && valido;
        valido = this.esEstadoVacacionValido() && valido;
        valido = this.esEstadoCivilValido() && valido;
        valido = this.esTipoValido() && valido;

        if(parseInt(this.tipo.id) === constantes.FLETERO){
            return valido;
        }

        valido = this.esAfpValida() && valido;
        valido = this.esSistemaSaludValido() && valido;

        return valido;
    },

    getJSON: function(){
        var rut = this.rut, json;
        rut = rut.replace(/\./g, '');

        json = {
            nombre: this.nombre,
            apellido: this.apellido,
            rut: rut,
            domicilio: this.domicilio,
            fechaNacimiento: common.fecha.fechaToJSON(this.fechaNacimiento),
            inicioContrato: common.fecha.fechaToJSON(this.inicioContrato),
            vigenciaLicencia: common.fecha.fechaToJSON(this.vigenciaLicencia),
            afp: this.afp.id,
            sistemaSalud: this.sistemaSalud.id,
            estadoCivil: this.estadoCivil.id,
            estadoVacacion: this.estadoVacacion.id,
            tipoTrabajador: this.tipo.id
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    _esFechaValida: function(campo){
        var valido = true;

        this.mensajes[campo] = '';

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = 'campo obligatorio';
        }else if(!type.isDate(this[campo])){
            valido = false;
            this.mensajes[campo] = 'fecha inválida';
        }

        return valido;
    },

    _esTextoValido: function(campo, customMje){
        var valido = true,
            regex = /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/i;

        this.mensajes[campo] = '';

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = 'campo obligatorio';
        }else if(!regex.test(this[campo])){
            valido = false;
            this.mensajes[campo] = customMje;
        }

        return valido;
    },

    _esSeleccionValida: function(campo){
        var valido = true;
        this.mensajes[campo] = '';

        if(!this[campo].id){
            valido = false;
            this.mensajes[campo] = 'campo obligatorio';
        }

        return valido;
    }
};

module.exports = Trabajador;

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/trabajador_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function service($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var action = App.urls.get('trabajador:todos');
            get(action, callback);
        },

        crear: function(param, callback){
            var action = App.urls.get('trabajador:crear');
            post(action, param, callback);
        },

        obtener: function(id, callback){
            var action = App.urls.get('trabajador:obtener');
            get(action, { id: id }, callback);
        },

        actualizar: function(params, callback){
            var action = App.urls.get('trabajador:actualizar');
            post(action, params, callback);
        },

        eliminar: function(id, callback){
            var action = App.urls.get('trabajador:eliminar');
            post(action, { id: id }, callback);
        },

        guardarBoleta: function(json, callback){
            var url = App.urls.get('trabajador:guardar_boleta');
            post(url, json, callback);
        },

        buscarBoleta: function(id, callback){
            var url = App.urls.get('trabajador:buscar_boleta');
            get(url, { id: id }, callback);
        }
    };

    return services;
};

module.exports = service;

},{"./service_util.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/trabajador_bundle.js"]);
