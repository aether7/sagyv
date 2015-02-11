(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"G:\\sagyv\\sagyv\\static\\js\\bundles\\reportes\\consumo_cliente_bundle.js":[function(require,module,exports){
"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// (function(){
// 'use strict';

// var app = angular.module('consumoClienteApp', [], App.httpProvider),
//     ConsumoClienteController = require('../../controllers/reportes/consumo_cliente_controller.js'),
//     consumoService = require('../../services/reportes/consumo_service.js');

// app.factory('consumoClienteService', consumoService);

// app.controller('ConsumoClienteController', ['consumoClienteService', ConsumoClienteController]);

// })();
var ReporteController = (function () {
    function ReporteController() {
        _classCallCheck(this, ReporteController);

        console.log("sadsa");
    }

    _prototypeProperties(ReporteController, null, {
        filtrar: {
            value: function filtrar() {
                console.log("filtrando");
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
        }
    });

    return ReporteController;
})();

var ReporteConsumo = (function (ReporteController) {
    function ReporteConsumo() {
        _classCallCheck(this, ReporteConsumo);

        _get(Object.getPrototypeOf(ReporteConsumo.prototype), "constructor", this).call(this);
        console.log("eaea");
    }

    _inherits(ReporteConsumo, ReporteController);

    _prototypeProperties(ReporteConsumo, null, {
        ruben: {
            value: function ruben() {
                console.log("ruben contra ruben");
            },
            writable: true,
            configurable: true
        },
        saludar: {
            value: function saludar() {
                console.log("hola");
            },
            writable: true,
            configurable: true
        }
    });

    return ReporteConsumo;
})(ReporteController);

var reporteController = new ReporteController();
reporteController.filtar();
reporteController.exportar();

},{}]},{},["G:\\sagyv\\sagyv\\static\\js\\bundles\\reportes\\consumo_cliente_bundle.js"]);
