(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/trabajador_bundle.js":[function(require,module,exports){
(function(){
'use strict';
var app = angular.module('trabajadorApp', [], App.httpProvider),
    trabajadorService = require('../services/trabajador_service.js'),
    TrabajadorController = require('../controllers/trabajador_controller.js');

app.factory('trabajadorService',['$http', trabajadorService]);
app.controller('TrabajadorController',['trabajadorService', TrabajadorController]);

})();

},{"../controllers/trabajador_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/trabajador_controller.js","../services/trabajador_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/trabajador_service.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/trabajador_controller.js":[function(require,module,exports){
var Trabajador = require('../models/trabajador/trabajador_model.js'),
    Boleta = require('../models/trabajador/boleta_model.js');

function TrabajadorController(service){
    this.service = service;
    this.trabajadores = [];
    this.trabajador = new Trabajador();
    this.boleta = new Boleta();

    this.init();
}

TrabajadorController.mixin({
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
                trabajador.inicioContrato = common.fecha.jsonToDate(obj.inicioContrato);
                trabajador.vigenciaLicencia = common.fecha.jsonToDate(obj.vigenciaLicencia);
                trabajador.afp = obj.afp;
                trabajador.sistemaSalud = obj.sistemaSalud;
                trabajador.estadoCivil = obj.estadoCivil;
                trabajador.estadoVacacion = obj.estadoVacacion;

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
        });trabajadores

        return resultado.length;
    },

    renderNuevoTrabajador: function(data){
        this.trabajadores.push(this.trabajador);

        $('#modal_nuevo').modal('hide');
        common.agregarMensaje('El trabajador ha sido creado exitosamente');
    },

    verTrabajador: function(index){
        var _this = this;
        this.trabajador = this.trabajadores[index];

        this.service.obtener(this.trabajador.id, function(data){
            _this.trabajador.boleta.boletaInicial = data.boleta.boleta_inicial
            _this.trabajador.boleta.boletaActual = data.boleta.boleta_actual
            _this.trabajador.boleta.boletaFinal = data.boleta.boleta_final
            common.mostrarModal('ver');
        });
    },

    editarTrabajador: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.trabajador = new Trabajador();

        this.service.obtener(id, function(data){
            common.mostrarModal('editar');

            _this.procesarTrabajador(data, 'id');
            _this.trabajador.id = id;
        });
    },

    actualizarTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        this.service.actualizar(this.trabajador.getJSON(), this.renderActualizarTrabajador);
    },

    renderActualizarTrabajador: function(data){
        var tr = $('#lista_trabajadores tr[data-id={0}]'.format(data.id));

        tr.find('td[data-campo=nombre]').text(data.nombre);
        tr.find('td[data-campo=apellido]').text(data.apellido);
        tr.find('td[data-campo=rut]').text(data.rut);
        tr.find('td[data-campo=estado_vacaciones]').text(data.estado_vacaciones);

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

    procesarTrabajador: function(data, campo){
        campo = campo || 'nombre';

        var fechaNac = new Date(common.fecha.agregarCeros(data.nacimiento) + ' 00:00:00'),
            fechaInicio = new Date(common.fecha.agregarCeros(data.fecha_inicio_contrato) + ' 00:00:00'),
            fechaVigencia = new Date(common.fecha.agregarCeros(data.vigencia_licencia) + ' 00:00:00');

        this.trabajador.nombre = data.nombre;
        this.trabajador.apellido = data.apellido;
        this.trabajador.rut = data.rut;
        this.trabajador.domicilio = data.domicilio;
        this.trabajador.fechaNacimiento = fechaNac;
        this.trabajador.inicioContrato = fechaInicio;
        this.trabajador.vigenciaLicencia = fechaVigencia;
        this.trabajador.afp = data.afp[campo];
        this.trabajador.sistemaSalud = data.sistema_salud[campo];
        this.trabajador.estadoCivil = data.estado_civil[campo];
        this.trabajador.estadoVacacion = data.estado_vacacion[campo];
        this.trabajador.boleta.boletaInicial = data.boleta.boleta_inicial;
        this.trabajador.boleta.boletaFinal = data.boleta.boleta_final;
        this.trabajador.boleta.boletaActual = data.boleta.boleta_actual;
    },

    anexarBoleta: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.boleta = new Boleta();

        this.service.buscarBoleta(id, function(data){
            _this.boleta.numeroAnterior = data.boleta_actual;
            _this.boleta.boletaInicial = data.boleta_final + 1;
            _this.boleta.boletaFinal = data.boleta_final + 2;
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
});

module.exports = TrabajadorController;

},{"../models/trabajador/boleta_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/trabajador/boleta_model.js","../models/trabajador/trabajador_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/trabajador/trabajador_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/trabajador/boleta_model.js":[function(require,module,exports){
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
            boleta_inicial: this.boletaInicial,
            boleta_final: this.boletaFinal,
            id: this.id
        };

        return json;
    }
});

module.exports = Boleta;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/trabajador/trabajador_model.js":[function(require,module,exports){
var Trabajador = function(){
    this.id = null;
    this.nombre = null;
    this.apellido = null;
    this.rut = null;
    this.domicilio = null;
    this.fechaNacimiento = null;
    this.inicioContrato = null;
    this.vigenciaLicencia = null;
    this.afp = null;
    this.sistemaSalud = null;
    this.estadoCivil = null;
    this.estadoVacacion = null;

    this.boleta = {};
    this.mensajes = {};
};

Trabajador.prototype = {
    constructor: App.Models.Trabajador,

    esNombreValido: function(){
        return this._esTextoValido("nombre", "El nombre no es válido");
    },

    esApellidoValido: function(){
        return this._esTextoValido("apellido", "El apellido no es válido");
    },

    esRutValido: function(){
        var valido = true;

        this.mensajes.rut = "";

        if(!this.rut){
            valido = false;
            this.mensajes.rut = "campo obligatorio";
        }else if(!$.Rut.validar(this.rut)){
            valido = false;
            this.mensajes.rut = "RUT no válido";
        }

        return valido;
    },

    esDomicilioValido: function(){
        var valido = true;

        this.mensajes.domicilio = "";

        if(!this.domicilio){
            valido = false;
            this.mensajes.domicilio = "campo obligatorio";
        }

        return valido;
    },

    esFechaNacimientoValida: function(){
        return this._esFechaValida("fechaNacimiento");
    },

    esInicioContratoValido: function(){
        return this._esFechaValida("inicioContrato");
    },

    esVigenciaLicenciaValida: function(){
        return this._esFechaValida("vigenciaLicencia");
    },

    esAfpValida: function(){
        return this._esSeleccionValida("afp");
    },

    esSistemaSaludValido: function(){
        return this._esSeleccionValida("sistemaSalud");
    },

    esEstadoCivilValido: function(){
        return this._esSeleccionValida("estadoCivil");
    },

    esEstadoVacacionValido: function(){
        return this._esSeleccionValida("estadoVacacion");
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
        valido = this.esAfpValida() && valido;
        valido = this.esSistemaSaludValido() && valido;
        valido = this.esEstadoCivilValido() && valido;
        valido = this.esEstadoVacacionValido() && valido;

        return valido;
    },

    getJSON: function(){
        var rut = this.rut, json;

        rut = rut.replace(/\./g, '');

        if(rut.indexOf('-') !== -1){
           rut = rut.split('');
           rut = rut.pop() + '-' + rut.slice(0).reverse().join('');
           rut = rut.split('').reverse().join('');
        }

        json = {
            nombre: this.nombre,
            apellido: this.apellido,
            rut: rut,
            domicilio: this.domicilio,
            fecha_nacimiento: common.fecha.fechaToJSON(this.fechaNacimiento),
            inicio_contrato: common.fecha.fechaToJSON(this.inicioContrato),
            vigencia_licencia: common.fecha.fechaToJSON(this.vigenciaLicencia),
            afp: this.afp,
            sistema_salud: this.sistemaSalud,
            estado_civil: this.estadoCivil,
            estado_vacacion: this.estadoVacacion
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
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

    _esTextoValido: function(campo, customMje){
        var valido = true,
            regex = /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/i;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!regex.test(this[campo])){
            valido = false;
            this.mensajes[campo] = customMje;
        }

        return valido;
    },

    _esSeleccionValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }

        return valido;
    }
};

module.exports = Trabajador;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/trabajador_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function service($http){
    var error, services;

    error = function(){
        alert('Ha ocurrido un error en el servicor');
    };

    services = {
        findAll: function(callback){
            var action = App.urls.get('trabajador:todos');
            $http.get(action).success(callback).error(serviceUtil.standardError);
        },

        crear: function(param, callback){
            var action = App.urls.get('trabajador:crear');
            $http.post(action, param).success(callback).error(serviceUtil.standardError);
        },

        obtener: function(id, callback){
            var action = App.urls.get('trabajador:obtener') + '?id=' + id;
            $http.get(action).success(callback).error(serviceUtil.standardError);
        },

        actualizar: function(params, callback){
            var action = App.urls.get('trabajador:actualizar');
            $http.post(action, params).success(callback).error(serviceUtil.standardError);
        },

        eliminar: function(id, callback){
            var action = App.urls.get('trabajador:eliminar'),
                json = { id : id };

            $http.post(action, json, callback).error(serviceUtil.standardError);
        },

        guardarBoleta: function(json, callback){
            var url = App.urls.get('trabajador:guardar_boleta');
            $http.post(url, json).success(callback).error(serviceUtil.standardError);
        },

        buscarBoleta: function(id, callback){
            var url = App.urls.get('trabajador:buscar_boleta');
            url += '?id=' + id;

            $http.get(url).success(callback).error(serviceUtil.standardError);
        }
    };

    return services;
};

module.exports = service;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/trabajador_bundle.js"]);
