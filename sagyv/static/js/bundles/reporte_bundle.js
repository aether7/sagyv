(function(){
'use strict';

var app = angular.module('reporteApp', []),
    ConsumoClienteController = require('../controllers/reportes/consumo_cliente_controller.js'),
    CreditoController = require('../controllers/reportes/credito_controller.js'),
    GasController = require('../controllers/reportes/gas_controller.js'),
    KilosController = require('../controllers/reportes/kilos_controller.js'),
    VentaController = require('../controllers/reportes/venta_controller.js'),
    consumoService = require('../services/reportes/consumo_service.js'),
    gasService = require('../services/reportes/gas_service.js');

app.factory('consumoService', consumoService);
app.factory('gasService', gasService);

app.controller('ConsumoClienteController', ['consumoService', ConsumoClienteController]);
app.controller('CreditoController', [CreditoController]);
app.controller('GasController', ['gasService', GasController]);
app.controller('KilosController', [KilosController]);
app.controller('VentaController', [VentaController]);

})();
