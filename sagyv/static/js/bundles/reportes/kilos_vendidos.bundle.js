(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/kilos_vendidos_bundle.js":[function(require,module,exports){
"use strict";

(function () {
  var app = angular.module("kilosVendidosApp", []);
  var KilosVendidosController = require("../../controllers/reportes/kilos_controller.js");
  var kilosVendidosService = require("../../services/reportes/kilos_vendidos_service.js");

  app.factory("kilosVendidosService", kilosVendidosService);

  app.controller("KilosVendidosController", ["kilosVendidosService", KilosVendidosController]);
})();

},{"../../controllers/reportes/kilos_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/kilos_controller.js","../../services/reportes/kilos_vendidos_service.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/reportes/kilos_vendidos_service.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/kilos_controller.js":[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ReporteController = require("./reporte_controller.js");

var KilosVendidosController = (function (ReporteController) {
    function KilosVendidosController(service) {
        _classCallCheck(this, KilosVendidosController);

        _get(Object.getPrototypeOf(KilosVendidosController.prototype), "constructor", this).call(this, service);
        this.init();
        this.kilos = [];
    }

    _inherits(KilosVendidosController, ReporteController);

    _prototypeProperties(KilosVendidosController, null, {
        init: {
            value: function init() {
                this.service.findAll(this.llenarKilos.bind(this));
            },
            writable: true,
            configurable: true
        },
        llenarKilos: {
            value: function llenarKilos(data) {
                this.kilos = data.map(function (kilo) {
                    kilo.trabajador.getNombreCompleto = function () {
                        return this.nombre + " " + this.apellido;
                    };

                    return kilo;
                });
            },
            writable: true,
            configurable: true
        },
        filtrar: {
            value: function filtrar() {
                console.log("filtrando desde %s hasta %s", this.desde, this.hasta);
            },
            writable: true,
            configurable: true
        },
        exportar: {
            value: function exportar() {
                console.log("exportando desde %s hasta %s", this.desde, this.hasta);
            },
            writable: true,
            configurable: true
        },
        graficar: {
            value: function graficar() {
                console.log("graficando desde %s hasta %s", this.desde, this.hasta);
            },
            writable: true,
            configurable: true
        }
    });

    return KilosVendidosController;
})(ReporteController);

module.exports = KilosVendidosController;

},{"./reporte_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/reporte_controller.js":[function(require,module,exports){
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

},{}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/services/reportes/kilos_vendidos_service.js":[function(require,module,exports){
"use strict";

var serviceUtil = require("../service_util.js");

function kilosVendidosService($http) {
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function (callback) {
            var url = App.urls.get("reportes:obtener_kilos_vendidos");
            get(url, callback);
        },

        filtrar: function () {}
    };

    return services;
}

module.exports = kilosVendidosService;

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

},{}]},{},["/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/kilos_vendidos_bundle.js"]);
