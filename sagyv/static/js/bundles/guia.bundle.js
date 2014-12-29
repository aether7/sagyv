(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/worker8/proyectos/sagyv/sagyv/static/js/bundles/guia_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('guiaApp', [], App.httpProvider),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js'),
    boletaService = require('../services/boleta_service.js'),
    TerminalController = require('../controllers/guias/terminal_controller.js'),
    BoletaController = require('../controllers/guias/boleta_controller.js');

app.factory('guiaService', ['$http', guiaService]);
app.factory('terminalService', ['$http', terminalService]);
app.factory('boletaService', ['$http', boletaService]);

app.controller('TerminalController', ['terminalService', TerminalController]);
app.controller('BoletaController', ['boletaService', BoletaController]);

})();

},{"../controllers/guias/boleta_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/boleta_controller.js","../controllers/guias/terminal_controller.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/terminal_controller.js","../services/boleta_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/boleta_service.js","../services/guia_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/guia_service.js","../services/terminal_service.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/terminal_service.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/boleta_controller.js":[function(require,module,exports){
var Boleta = require('../../models/guias/boleta_model.js');

function BoletaController(service){
    this.service = service;
    this.boletas = [];
    this.boleta = null;

    this.init();
}

BoletaController.mixin({
    init: function(){
        this.service.findAll(this.procesarBoletas.bind(this));
    },

    procesarBoletas: function(data){
        var _this = this;

        data.forEach(function(b){
            var boleta = new Boleta();
            boleta.inicial = b.inicial;
            boleta.ultima = b.ultima;
            boleta.actual = b.actual;
            boleta.trabajador = b.trabajador;
            _this.boletas.push(boleta);
        });
    },

    mostrarPanel: function(nombre, index){
        this['_' + nombre](index);
    },

    _nuevo: function(){
        this.boleta = new Boleta();
        $('#modal_boleta_agregar').modal('show');
    },

    _editar: function(index){
        this.boleta = this.boletas[index];
        $('#modal_boleta_editar').modal('show');
    },

    agregar: function(){
        if(!this.boleta.esValido()){
            return;
        }else if(this.estaDuplicadoTrabajador(this.boleta)){
            this.boleta.mensajes.trabajador = 'El trabajador ya tiene otro talonario anexado';
            return;
        }

        this.boleta.trabajador.nombre = $('#boleta_agregar_trabajador option:selected').text();

        var json = this.boleta.toJSON();
        this.service.agregar(json, this.procesarAgregar.bind(this));
    },

    editar: function(){
        if(!this.boleta.esValido()){
            return;
        }else if(this.estaDuplicadoTrabajador(this.boleta)){
            this.boleta.mensajes.trabajador = 'El trabajador ya tiene otro talonario anexado';
            return;
        }

        this.boleta.trabajador.nombre = $('#boleta_editar_trabajador option:selected').text();
        var json = this.boleta.toJSON();
        this.service.editar(json, this.procesarEditar.bind(this));
    },

    estaDuplicadoTrabajador: function(){
        var trabajadorSeleccionado = $('#boleta_agregar_trabajador option:selected').text(),
            trabajadoresAsignados = this.boletas.filter(function(boleta){
                return boleta.trabajador.nombre === trabajadorSeleccionado;
            });

        return trabajadoresAsignados.length;
    },

    procesarAgregar: function(data){
        this.boletas.push(this.boleta);

        common.agregarMensaje('El talonario ha sido creado exitosamente');
        $('#modal_boleta_agregar').modal('hide');
    },

    eliminar: function(index){
        if(!confirm('¿Está seguro(a) de que desea realizar esta acción?')){
            return;
        }

        this.boletas.splice(index, 1);
        common.agregarMensaje('El talonario fue eliminado exitosamente');
    }
});

module.exports = BoletaController;

},{"../../models/guias/boleta_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/boleta_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/controllers/guias/terminal_controller.js":[function(require,module,exports){
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

},{"../../models/guias/terminal_model.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/terminal_model.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/boleta_model.js":[function(require,module,exports){
function Boleta(){
    this.id = null;
    this.inicial = 0;
    this.ultima = 0;
    this.actual = 0;

    this.trabajador = {
        id: 0,
        nombre: null
    };

    this.mensajes = {};
}

Boleta.prototype = {
    constructor: Boleta,

    esValido: function(){
        var valido = true;

        this.mensajes = {};

        valido = this.esInicialValido() && valido;
        valido = this.esUltimaValido() && valido;
        valido = this.esTrabajadorValido() && valido;

        return valido;
    },

    esInicialValido: function(){
        if(!this.inicial || isNaN(this.inicial)){
            this.mensajes.inicial = 'Campo obligatorio';
            return false;
        }else if(parseInt(this.inicial) < 1){
            this.mensajes.inicial = 'El número de boleta inicial debe al menos ser 1';
            return false;
        }

        return true;
    },

    esUltimaValido: function(){
        if(!this.ultima || isNaN(this.ultima)){
            this.mensajes.ultima = 'Campo obligatorio';
            return false;
        }else if(parseInt(this.ultima) < 1){
            this.mensajes.ultima = 'El número de boleta final debe al menos ser 1';
            return false;
        }else if(parseInt(this.inicial) >= parseInt(this.ultima)){
            this.mensajes.inicial = 'El número de boleta final debe ser mayor a la boleta inicial';
            this.mensajes.ultima = 'El número de boleta final debe ser mayor a la boleta inicial';
            return false;
        }

        return true;
    },

    esTrabajadorValido: function(){
        if(!this.trabajador.id){
            this.mensajes.trabajador = 'Campo obligatorio';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            inicial: this.inicial,
            ultima: this.ultima,
            actual: this.actual,
            trabajador: JSON.stringify(this.trabajador)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = Boleta;

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/models/guias/terminal_model.js":[function(require,module,exports){
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

},{}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/boleta_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function boletaService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('guias:obtener_talonarios');
            get(url, callback);
        },

        agregar: function(json, callback){
            var url = App.urls.get('guias:crear_talonario');
            post(url, json, callback);
        },

        editar: function(json, callback){
            var url = App.urls.get('guias:editar_talonario');
            console.warn('por implementar');
        },

        eliminar: function(id, callback){
            var url = App.urls.get('guias:eliminar_talonario');
            console.warm('por implementar');
        }
    };

    return services;
}

module.exports = boletaService;

},{"./service_util.js":"/home/worker8/proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/home/worker8/proyectos/sagyv/sagyv/static/js/services/guia_service.js":[function(require,module,exports){
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
