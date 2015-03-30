(()=>{
var app = angular.module('kilosVendidosApp', []);
var KilosVendidosController = require('../../controllers/reportes/kilos_controller.js');

app.controller('KilosVendidosController',[KilosVendidosController]);
})();
