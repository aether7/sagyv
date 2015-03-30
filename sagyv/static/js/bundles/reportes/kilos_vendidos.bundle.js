(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/kilos_vendidos_bundle.js":[function(require,module,exports){
"use strict";

(function () {
  var app = angular.module("kilosVendidosApp", []);
  var KilosVendidosController = require("../../controllers/reportes/kilos_controller.js");

  app.controller("KilosVendidosController", [KilosVendidosController]);
})();

},{"../../controllers/reportes/kilos_controller.js":"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/kilos_controller.js"}],"/home/sreal/Escritorio/sagyv/sagyv/static/js/controllers/reportes/kilos_controller.js":[function(require,module,exports){
"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ReporteController = require("./reporte_controller.js");

var KilosVendidosController = (function (ReporteController) {
  function KilosVendidosController() {
    _classCallCheck(this, KilosVendidosController);

    if (ReporteController != null) {
      ReporteController.apply(this, arguments);
    }
  }

  _inherits(KilosVendidosController, ReporteController);

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

},{}]},{},["/home/sreal/Escritorio/sagyv/sagyv/static/js/bundles/reportes/kilos_vendidos_bundle.js"]);
