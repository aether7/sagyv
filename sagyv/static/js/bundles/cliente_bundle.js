(function(){
'use strict';
var app = angular.module('clienteApp', []),
    formatoRut = require('../filters/string_filters.js').formatoRut,
    situacionComercialService = require('../services/cliente/situacion_comercial_service.js'),
    clienteService = require('../services/cliente/cliente_service.js'),
    SituacionComercialController = require('../controllers/cliente/situacion_comercial_controller.js'),
    ClienteController = require('../controllers/cliente/cliente_controller.js');

app.factory('situacionComercialService', ['$http', situacionComercialService]);
app.factory('clienteService', ['$http', clienteService]);

app.filter('formatoRut', formatoRut);

app.controller('ClienteController', ['clienteService','$rootScope', ClienteController]);
app.controller('SituacionComercialController', ['situacionComercialService','$rootScope', SituacionComercialController]);

})();
