(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/consumo_cliente_bundle.js":[function(require,module,exports){
"use strict";

(function () {
    var app = angular.module("consumoClienteApp", [], App.httpProvider),
        consumoService = require("../../services/reportes/consumo_service.js"),
        ConsumoClienteController = require("../../controllers/reportes/consumo_cliente_controller.js");

    app.factory("consumoClienteService", consumoService);
    app.controller("ConsumoClienteController", ["consumoClienteService", ConsumoClienteController]);
})();

},{"../../controllers/reportes/consumo_cliente_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js","../../services/reportes/consumo_service.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/reportes/consumo_service.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/consumo_cliente_controller.js":[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var FIJO = 1;
var PORCENTAJE = 2;

var ReporteController = require("./reporte_controller.js");
var graphData = require("../../utils/reporte_graph_data.js");

var ConsumoClienteController = (function (ReporteController) {
    function ConsumoClienteController(service) {
        _classCallCheck(this, ConsumoClienteController);

        _get(Object.getPrototypeOf(ConsumoClienteController.prototype), "constructor", this).call(this, service);
        this.consumos = null;
        this.service.findAll(this.cargaConsumos.bind(this));
    }

    _inherits(ConsumoClienteController, ReporteController);

    _prototypeProperties(ConsumoClienteController, null, {
        cargaConsumos: {
            value: function cargaConsumos(data) {
                this.consumos = data.map(function (d) {
                    var descripcion = "Sin descuento";

                    if (d.descuento.tipo === FIJO) {
                        descripcion = "$" + d.descuento.monto + " en ( " + d.descuento.producto + " )";
                    } else if (d.descuento.tipo === PORCENTAJE) {
                        descripcion = d.descuento.monto + "% en ( " + d.descuento.producto + " )";
                    }

                    d.descuento.descripcion = descripcion;
                    return d;
                });
            },
            writable: true,
            configurable: true
        },
        filtrar: {
            value: function filtrar() {
                var _this = this;
                this.service.filtrar(this.desde, this.hasta, function () {
                    _this.cargaConsumos.bind(_this);
                    $("#tabDetalle").tab("show");
                });
            },
            writable: true,
            configurable: true
        },
        exportar: {
            value: function exportar() {
                console.log("exportando");
            },
            writable: true,
            configurable: true
        },
        graficar: {
            value: function graficar() {
                $("#tabGrafico").tab("show");
                var data = graphData;

                data.title.text = "Consumo de clientes";
                data.yAxis.title.text = "Cantidad ( cu )";
                data.series = [{
                    name: "cod 1105",
                    data: [7, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: "cod 1145",
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17, 16.6, 14.2, 10.3, 6.6, 4.8]
                }];

                $("#canvas_grafico").highcharts(data);
            },
            writable: true,
            configurable: true
        }
    });

    return ConsumoClienteController;
})(ReporteController);

module.exports = ConsumoClienteController;

},{"../../utils/reporte_graph_data.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/utils/reporte_graph_data.js","./reporte_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js":[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ReporteController = (function () {
    function ReporteController(service) {
        _classCallCheck(this, ReporteController);

        this.service = service;
        this.desde = null;
        this.hasta = null;
    }

    _prototypeProperties(ReporteController, null, {
        filtrar: {
            value: function filtrar() {
                throw new Error("método no implementado");
            },
            writable: true,
            configurable: true
        },
        exportar: {
            value: function exportar() {
                throw new Error("método no implementado");
            },
            writable: true,
            configurable: true
        },
        graficar: {
            value: function graficar() {
                throw new Error("método no implementado");
            },
            writable: true,
            configurable: true
        }
    });

    return ReporteController;
})();

module.exports = ReporteController;

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/reportes/consumo_service.js":[function(require,module,exports){
"use strict";

var serviceUtil = require("../service_util.js");

function consumoService($http) {
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function (callback) {
            var url = App.urls.get("reportes:obtener_consumo");

            get(url, callback);
        },

        filtrar: function (fechaInicio, fechaTermino, callback) {
            var url = App.urls.get("reportes:obtener_consumo");

            get(url, { fechaInicio: fechaInicio, fechaTermino: fechaTermino }, callback);
        }
    };

    return services;
}

module.exports = consumoService;

},{"../service_util.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/service_util.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
"use strict";

function noop() {}

function standardError(data) {
    alert("ha ocurrido un error en el servidor !!!, por favor informe al administrador");
};

function processURL(url, params) {
    var queryStr = [];

    Object.keys(params).forEach(function (key) {
        queryStr.push(key + "=" + params[key]);
    });

    url += "?" + queryStr.join("&");
    return url;
};

function URLMaker() {
    this.url = null;
}

URLMaker.prototype.withThis = function (url) {
    this.url = url;
    return this;
};

URLMaker.prototype.doQuery = function (params) {
    var queryStr = [];

    Object.keys(params).forEach(function (key) {
        queryStr.push(key + "=" + params[key]);
    });

    this.url += "?" + queryStr.join("&");
    return this.url;
};

exports.standardError = standardError;
exports.processURL = processURL;
exports.URLMaker = URLMaker;

exports.getMaker = function ($http) {
    return function () {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            url = args.shift();

        if (args.length) {
            url = new URLMaker().withThis(url).doQuery(args[0]);
        }

        $http.get(url).success(callback || noop).error(standardError);
    };
};

exports.postMaker = function ($http) {
    return function (url, params, callback) {
        $http.post(url, params).success(callback || noop).error(standardError);
    };
};

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/utils/reporte_graph_data.js":[function(require,module,exports){
"use strict";

var data = {
    chart: {
        type: "line"
    },
    title: {
        text: "Consumo de clientes"
    },
    subtitle: {
        text: ""
    },
    xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    yAxis: {
        title: {
            text: "Cantidad( cu )"
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

},{}]},{},["/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/consumo_cliente_bundle.js"]);
