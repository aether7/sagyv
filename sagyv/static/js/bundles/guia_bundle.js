(function(){
'use strict';

var app = angular.module('guiaApp', [], App.httpProvider),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js'),
    TerminalController = require('../controllers/guias/terminal_controller.js'),
    BoletaController = require('../controllers/guias/boleta_controller.js');

app.factory('guiaService', ['$http', guiaService]);
app.factory('terminalService', ['$http', terminalService]);

app.controller('TerminalController', ['terminalService', TerminalController]);
app.controller('BoletaController', [BoletaController]);

})();
