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
function TerminalController(service){
    this.service = service;

    this.terminal = {};
    this.mensajes = {};
    this.terminales = [];

    this.init();
}

TerminalController.mixin({
    init: function(){
        var _this = this;

        this.service.findAll(function(data){
            _this.terminales = data.terminales;
        });
    },

    mostrarPanel: function(){
        this.terminal = {};
        this.mensajes = {};

        $('#modal_terminal_agregar').modal('show');
        console.log('mostrando panel');
    },

    mostrarPanelAsignar: function(index){
        this.mensajes = {};
        this.terminal = this.terminales[index];
        this.terminal.vehiculoAsignado = null;
        console.log(this.terminal);
        $('#modal_terminal_asignar').modal('show');
    },

    agregar: function(){
        var valido = true,
        _this = this;

        this.mensajes = {};

        if(!this.terminal.numero){
            this.mensajes.numero = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.terminal.numero)){
            this.mensajes.numero = 'número inválido';
            valido = false;
        }

        if(!this.terminal.vehiculo){
            this.mensajes.vehiculo = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            return;
        }

        this.service.create(this.terminal, function(data){
            _this.terminales = data.terminales;
            common.agregarMensaje('terminal agregado exitosamente');
            $('#modal_terminal_agregar').modal('hide');
        });

    },

    asignar: function(){
        var valido = true,
        _this = this;

        this.mensajes = {};

        if(!this.terminal.vehiculoAsignado){
            this.mensajes.vehiculoAsignado = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            console.log(this.mensajes.vehiculoAsignado);
            return;
        }
        this.terminal.vehiculo = this.terminal.vehiculoAsignado;
        console.log(this.terminal);

        this.service.asignar(this.terminal, function(data){
            _this.terminales = data.terminales;
            common.agregarMensaje('terminal agregado exitosamente');
            $('#modal_terminal_asignar').modal('hide');
        });
    },

    remover: function(index){
        var _this = this,
            confirmacion = confirm("Desea dar de baja la terminal " + _this.terminales[index].codigo);
        if (confirmacion == true) {
            this.service.remove(_this.terminales[index].id, function(data){
                _this.terminales.splice(index, 1);
                common.agregarMensaje('terminal dada de baja exitosamente');
            });
        }
    },

    maintenance:function(index){
        var _this = this,
            confirmacion = confirm("Desea enviar a mantención la terminal " + _this.terminales[index].codigo);
        if (confirmacion == true) {
            this.service.maintenance(_this.terminales[index].id, function(data){
                _this.terminales[index] = data;
                common.agregarMensaje('terminal envidada a mantención exitosamente');
            });
        }
    }
});

module.exports = TerminalController;

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
            var url = App.urls.get('guias:maintenance')
            post(url, { id : id }, callback);
        }
    };

    return services;
}

module.exports = terminalService;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}]},{},["/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/guia_bundle.js"]);
