(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/guia_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('guiaApp', [], App.httpProvider),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js'),
    TerminalController = require('../controllers/guias/terminal_controller.js');

app.factory('guiaService', ['$http', guiaService]);
app.factory('terminalService', ['$http', terminalService]);

app.controller('TerminalController', ['terminalService', TerminalController]);

})();

},{"../controllers/guias/terminal_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/terminal_controller.js","../services/guia_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/guia_service.js","../services/terminal_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/terminal_service.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/terminal_controller.js":[function(require,module,exports){
var Terminal = require('../../models/guias/terminal_model.js');

function TerminalController(service){
    this.service = service;

    this.terminales = [];
    this.terminal = null;
    this.index = null;

    this.init();
}

TerminalController.mixin({
    init: function(){
        var _this = this;

        this.service.findAll(function(data){

            data.terminales.forEach(function(t){
                var terminal = new Terminal();
                terminal.addData(t);
                _this.terminales.push(terminal);
            });
        });
    },

    procesarTerminales: function(data){
        var _this = this;

        data.terminales.forEach(function(){
            var terminal = new Terminal();
            _this.terminales.push(terminal);
        });
    },

    mostrarPanel: function(nombrePanel, param){
        this['_' + nombrePanel](param);
    },

    _agregar: function(){
        $('#modal_terminal_agregar').modal('show');
        this.terminal = new Terminal();
    },

    _asignar: function(index){
        this.index = index;

        $('#modal_terminal_asignar').modal('show');
        this.terminal = this.terminales[index];
        this.terminal.resetearMovil();
    },

    _editar: function(index){
        this.index = index;

        $('#modal_terminal_editar').modal('show');
        this.terminal = this.terminales[index];
    },

    agregar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.service.create(json, this.procesarAgregar.bind(this));
    },

    procesarAgregar: function(data){
        this.terminal.id = data.id;
        this.terminal.codigo = data.codigo;
        this.terminal.estado = data.estado;
        this.terminal.movil = data.movil;

        this.terminales.push(this.terminal);
        this.terminal = null;

        common.agregarMensaje('terminal agregado exitosamente');
        $('#modal_terminal_agregar').modal('hide');
    },

    remover: function(index){
        if(!confirm('Desea dar de baja la terminal ' + this.terminales[index].codigo)){
            return;
        }

        var terminal = this.terminales[index],
            _this = this;

        this.service.remove(terminal.id, function(){
            _this.terminales.splice(index, 1);
            common.agregarMensaje('terminal eliminada exitosamente');
        });
    },

    asignar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.terminales[this.index] = this.terminal;

        $('#modal_terminal_asignar').modal('hide');
        common.agregarMensaje('la asignación fue realizada exitosamente');
    },

    editar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.service.edit(json, this.procesarEditar.bind(this));
    },

    procesarEditar: function(data){
        this.terminales[this.index] = this.terminal;

        $('#modal_terminal_editar').modal('hide');
        common.agregarMensaje('La terminal fue editada exitosamente');
    },

    maintenance:function(index){
    },

    returnMaintenance:function(index){
    },
});

module.exports = TerminalController;

},{"../../models/guias/terminal_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/terminal_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/terminal_model.js":[function(require,module,exports){
function Terminal(){
    this.id = null;
    this.codigo = null;
    this.movil = {};
    this.estado = {};

    this.mensajes = {};
}

Terminal.mixin({
    addData: function(terminal){
        this.id = terminal.id;
        this.codigo = terminal.codigo;
        this.movil = terminal.movil;
        this.estado = terminal.estado;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this.esCodigoValido() && valido;
        valido = this.esVehiculoValido() && valido;

        return valido;
    },

    esCodigoValido: function(){
        if(!this.codigo){
            this.mensajes.codigo = 'Campo obligatorio';
            return false;
        }

        return true;
    },

    esVehiculoValido: function(){
        if(!this.movil.id){
            this.mensajes.movil = 'Campo obligatorio';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            codigo: this.codigo,
            movil: JSON.stringify(this.movil),
            estado: JSON.stringify(this.estado)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    resetearMovil: function(){
        this.movil = {
            id: 0,
            numero: null
        };
    }
});

module.exports = Terminal;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/guia_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function guiaService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {

    };

    return services;
}

module.exports = guiaService;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/terminal_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function terminalService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('guias:obtener_terminales');
            get(url, callback);
        },

        create: function(terminal, callback){
            var url = App.urls.get('guias:crear_terminal');
            post(url, terminal, callback);
        },

        edit: function(terminal, callback){
            var url = App.urls.get('guias:editar_teminal');

            post(url, terminal, callback);
        },

        remove: function(id, callback){
            var url = App.urls.get('guias:remover_terminal');
            post(url, { id : id }, callback);
        },

        asignar: function(terminal, callback){
            var url = App.urls.get('guias:asignar');
            post(url, terminal, callback);
        },

        maintenance: function(id, callback){
            var url = App.urls.get('guias:maintenance');
            post(url, { id : id }, callback);
        },

        returnMaintenance: function(id, callback){
            var url = App.urls.get('guias:return_maintenance');
            post(url, {id : id}, callback);
        }
    };

    return services;
}

module.exports = terminalService;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/guia_bundle.js"]);
