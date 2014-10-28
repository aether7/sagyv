(function(){
'use strict';

var app = angular.module('guiaApp', []),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js'),
    TerminalController = require('../controllers/guias/terminal_controller.js');

app.factory('guiaService', guiaService);
app.factory('terminalService', terminalService);

app.controller('TerminalController', ['terminalService', TerminalController]);

})();
