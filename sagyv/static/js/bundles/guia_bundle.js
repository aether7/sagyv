(function(){
'use strict';

var app = angular.module('guiaApp', [], App.httpProvider),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js'),
    boletaService = require('../services/boleta_service.js'),
    TerminalController = require('../controllers/guias/terminal_controller.js'),
    BoletaController = require('../controllers/guias/boleta_controller.js'),
    GuiaController = require('../controllers/guias/guia_controller.js');

app.factory('guiaService', ['$http', guiaService]);
app.factory('terminalService', ['$http', terminalService]);
app.factory('boletaService', ['$http', boletaService]);

app.controller('GuiaController', ['guiaService', GuiaController]);
app.controller('TerminalController', ['terminalService', TerminalController]);
app.controller('BoletaController', ['boletaService', BoletaController]);

})();
