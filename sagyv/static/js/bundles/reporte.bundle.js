(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/reporte_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('reporteApp', []),
    ConsumoClienteController = require('../controllers/reportes/consumo_cliente_controller.js'),
    consumoService = require('../services/consumo_service.js');

app.factory('consumoService', consumoService);

function ReporteController(){
    this.desde = null;
    this.hasta = null;
}

ReporteController.mixin({
    filtrar: function(){
        console.log('filtrando');
    },

    exportar: function(){
        console.log('exportando');
    },

    graficar: function(){
        console.log('graficando');
    }
});

function CreditoController(){
    ReporteController.call(this);
}

CreditoController.mixin(ReporteController, {});

function GasController(){
    ReporteController.call(this);
}

GasController.mixin(ReporteController, {});

function KilosController(){
    ReporteController.call(this);
}

KilosController.mixin(ReporteController, {});

function VentaController(){
    ReporteController.call(this);
}

VentaController.mixin(ReporteController, {});

app.controller('ConsumoClienteController', ['consumoService', ConsumoClienteController]);
app.controller('CreditoController', [CreditoController]);
app.controller('GasController', [GasController]);
app.controller('KilosController', [KilosController]);
app.controller('VentaController', [VentaController]);

console.log('reporte app');
})();

},{"../controllers/reportes/consumo_cliente_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js","../services/consumo_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/consumo_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js":[function(require,module,exports){
var ReporteController = require('./reporte_controller.js');

function ConsumoClienteController(service){
    ReporteController.call(this, service);
    this.consumos = [];
    this.init();
}

ConsumoClienteController.mixin(ReporteController, {
    init: function(){
        this.service.findAll(this.cargaConsumos.bind(this));
    },

    cargaConsumos: function(data){
        this.consumos = data;
    }
});

module.exports = ConsumoClienteController;

},{"./reporte_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js":[function(require,module,exports){
function ReporteController(service){
    this.desde = null;
    this.hasta = null;
    this.service = service;
}

ReporteController.mixin({
    filtrar: function(){
        console.log('filtrando');
    },

    exportar: function(){
        console.log('exportando');
    },

    graficar: function(){
        console.log('graficando');
    }
});

module.exports = ReporteController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/consumo_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function consumoService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('reportes:obtener_consumo');

            get(url, callback);
        },

        filtrar: function(fechaInicio, fechaTermino, callback){
            var url = App.urls.get('reportes:obtener_consumo');

            get(url,{ fechaInicio : fechaInicio, fechaTermino : fechaTermino }, callback);
        }
    };

    return services;
}

module.exports = consumoService;

},{"./service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/reporte_bundle.js"]);
