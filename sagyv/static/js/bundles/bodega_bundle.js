(function(){
'use strict';

var app = angular.module('bodegaApp', [], App.httpProvider),
    BodegaController = require('../controllers/bodega/bodega_controller.js'),
    GuiaController = require('../controllers/bodega/guia_controller.js'),
    TransitoController = require('../controllers/bodega/transito_controller.js'),
    GuiaProductoController = require('../controllers/bodega/guia_producto_controller.js'),
    bodegaService = require('../services/bodega_service.js');

app.factory('bodegaService', bodegaService);

app.controller('BodegaController', ['bodegaService', BodegaController]);
app.controller('GuiaController', ['$scope','bodegaService', GuiaController]);
app.controller('TransitoController', ['bodegaService', TransitoController]);
app.controller('GuiaProductoController', ['bodegaService', GuiaProductoController]);

})();
