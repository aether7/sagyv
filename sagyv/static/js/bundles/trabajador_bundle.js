(function(){
'use strict';
var app = angular.module('trabajadorApp', [], App.httpProvider),
    trabajadorService = require('../services/trabajador_service.js'),
    TrabajadorController = require('../controllers/trabajador_controller.js');

app.factory('trabajadorService',['$http', trabajadorService]);
app.controller('TrabajadorController',['trabajadorService', TrabajadorController]);

})();
