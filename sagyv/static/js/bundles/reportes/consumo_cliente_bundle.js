(function(){
'use strict';

var app = angular.module('consumoClienteApp', [], App.httpProvider),
    ConsumoClienteController = require('../../controllers/reportes/consumo_cliente_controller.js'),
    consumoService = require('../../services/reportes/consumo_service.js');

app.factory('consumoClienteService', consumoService);

app.controller('ConsumoClienteController', ['consumoClienteService', ConsumoClienteController]);

})();
