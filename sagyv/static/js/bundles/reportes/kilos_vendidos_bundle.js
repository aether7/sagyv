(()=>{
var app = angular.module('kilosVendidosApp', []);
var KilosVendidosController = require('../../controllers/reportes/kilos_controller.js');
var kilosVendidosService = require('../../services/reportes/kilos_vendidos_service.js');

app.factory('kilosVendidosService', kilosVendidosService);

app.controller('KilosVendidosController',['kilosVendidosService', KilosVendidosController]);
})();
