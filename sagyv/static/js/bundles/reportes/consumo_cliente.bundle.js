(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/reportes/consumo_cliente_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('consumoClienteApp', [], App.httpProvider),
    ConsumoClienteController = require('../../controllers/reportes/consumo_cliente_controller.js'),
    consumoService = require('../../services/reportes/consumo_service.js');

app.factory('consumoClienteService', consumoService);

app.controller('ConsumoClienteController', ['consumoClienteService', ConsumoClienteController]);

})();

},{"../../controllers/reportes/consumo_cliente_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js","../../services/reportes/consumo_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/reportes/consumo_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js":[function(require,module,exports){
var ReporteController = require('./reporte_controller.js'),
    graphData = require('../../utils/reporte_graph_data.js');

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
    },

    filtrar: function(){
        var fechaInicio, fechaTermino;

        if(this.desde){
            fechaInicio = common.fecha.fechaToJSON(this.desde);
        }

        if(this.hasta){
            fechaTermino = common.fecha.fechaToJSON(this.hasta);
        }

        console.log('fecha inicio: %s', fechaInicio);
        console.log('fecha termino: %s', fechaTermino);

        this.service.filtrar(fechaInicio, fechaTermino, this.cargaConsumos.bind(this));
        $('#tabDetalle').tab('show');
    },

    graficar: function(){
        $('#tabGrafico').tab('show');

        var data = graphData;

        data.title.text = 'Consumo de clientes';
        data.yAxis.title.text = 'Cantidad ( cu )';
        data.series = [
            {
                name: 'cod 1105',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            },
            {
                name: 'cod 1145',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }
        ];

        $('#canvas_grafico').highcharts(data);
    }
});

module.exports = ConsumoClienteController;

},{"../../utils/reporte_graph_data.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/utils/reporte_graph_data.js","./reporte_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js":[function(require,module,exports){
function ReporteController(service){
    this.desde = null;
    this.hasta = null;
    this.service = service;
}

ReporteController.mixin({
    filtrar: function(){
        console.log('filtrando');
        console.log('desde %s', this.desde);
        console.log('hasta %s', this.hasta);
    },

    exportar: function(){
        console.log('exportando');
        console.log('desde %s', this.desde);
        console.log('hasta %s', this.hasta);
    },

    graficar: function(){
        console.log('graficando');
        console.log('desde %s', this.desde);
        console.log('hasta %s', this.hasta);
    }
});

module.exports = ReporteController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/reportes/consumo_service.js":[function(require,module,exports){
var serviceUtil = require('../service_util.js');

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

},{"../service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/utils/reporte_graph_data.js":[function(require,module,exports){
var data = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Consumo de clientes'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Cantidad( cu )'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: []
};

module.exports = data;

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/reportes/consumo_cliente_bundle.js"]);