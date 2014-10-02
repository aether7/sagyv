(function(){
'use strict';

var app = angular.module('bodegaApp', [], App.httpProvider),
    BodegaController = require('../controllers/bodega/bodega_controller.js'),
    GuiaController = require('../controllers/bodega/guia_controller.js'),
    TransitoController = require('../controllers/bodega/transito_controller.js'),
    GuiaProductoController = require('../controllers/bodega/guia_producto_controller.js'),
    bodegaService = require('../services/bodega_service.js');

app.factory('bodegaService', bodegaService);

app.controller('BodegaController', ['$rootScope', 'bodegaService', BodegaController]);
app.controller('GuiaController', ['$rootScope','bodegaService', GuiaController]);
app.controller('TransitoController', ['$rootScope', 'bodegaService', TransitoController]);
app.controller('GuiaProductoController', ['$rootScope', 'bodegaService', GuiaProductoController]);

})();
