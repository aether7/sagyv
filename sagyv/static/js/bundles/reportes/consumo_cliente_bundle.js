// (function(){
// 'use strict';

// var app = angular.module('consumoClienteApp', [], App.httpProvider),
//     ConsumoClienteController = require('../../controllers/reportes/consumo_cliente_controller.js'),
//     consumoService = require('../../services/reportes/consumo_service.js');

// app.factory('consumoClienteService', consumoService);

// app.controller('ConsumoClienteController', ['consumoClienteService', ConsumoClienteController]);

// })();
class ReporteController{
    constructor(){
        console.log('sadsa');
    }

    filtrar(){
        console.log('filtrando');
    }

    exportar(){
        console.log('exportando');
    }
}

class ReporteConsumo extends ReporteController{
    constructor(){
        super();
        console.log('eaea');
    }

    ruben(){
        console.log('ruben contra ruben');
    }

    saludar(){
        console.log('hola');
    }
}

var reporteController = new ReporteController();
reporteController.filtar();
reporteController.exportar();
