(function(){
'use strict';

var app = angular.module('bodegaApp', [], App.httpProvider),
    BodegaController = require('../controllers/bodega_controller.js'),
    GuiaController = require('../controllers/guia_controller.js'),
    TransitoController = require('../controllers/transito_controller.js'),
    GuiaProductoController = require('../controllers/guia_producto_controller.js'),
    bodegaService = require('../services/bodega_service.js');

app.factory('bodegaService', bodegaService);

app.controller('BodegaController', ['$http', BodegaController]);
app.controller('GuiaController', ['$scope','bodegaService', GuiaController]);
app.controller('TransitoController', ['$http', TransitoController]);
app.controller('GuiaProductoController', ['$http', GuiaProductoController]);

})();
