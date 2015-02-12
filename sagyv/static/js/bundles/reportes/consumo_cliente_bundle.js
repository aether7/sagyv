(()=>{
    var app = angular.module('consumoClienteApp', [], App.httpProvider),
        consumoService = require('../../services/reportes/consumo_service.js'),
        ConsumoClienteController = require('../../controllers/reportes/consumo_cliente_controller.js');

    app.factory('consumoClienteService', consumoService);
    app.controller('ConsumoClienteController', ['consumoClienteService', ConsumoClienteController]);
})();
