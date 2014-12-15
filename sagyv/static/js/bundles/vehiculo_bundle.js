(function(){
'use strict';

var app = angular.module('vehiculoApp', [], App.httpProvider),
    VehiculoController = require('../controllers/vehiculo/vehiculo_controller.js'),
    vehiculoService = require('../services/vehiculo_service.js');

app.factory('vehiculoService', vehiculoService);
app.controller('VehiculoController', ['vehiculoService', VehiculoController]);

})();
