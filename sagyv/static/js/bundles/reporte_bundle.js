(function(){
'use strict';

var app = angular.module('reporteApp', []),
    ConsumoClienteController = require('../controllers/reportes/consumo_cliente_controller.js'),
    consumoService = require('../services/consumo_service.js');

app.factory('consumoService', consumoService);

function ReporteController(){
    this.desde = null;
    this.hasta = null;
}

ReporteController.mixin({
    filtrar: function(){
        console.log('filtrando');
    },

    exportar: function(){
        console.log('exportando');
    },

    graficar: function(){
        console.log('graficando');
    }
});

function CreditoController(){
    ReporteController.call(this);
}

CreditoController.mixin(ReporteController, {});

function GasController(){
    ReporteController.call(this);
}

GasController.mixin(ReporteController, {});

function KilosController(){
    ReporteController.call(this);
}

KilosController.mixin(ReporteController, {});

function VentaController(){
    ReporteController.call(this);
}

VentaController.mixin(ReporteController, {});

app.controller('ConsumoClienteController', ['consumoService', ConsumoClienteController]);
app.controller('CreditoController', [CreditoController]);
app.controller('GasController', [GasController]);
app.controller('KilosController', [KilosController]);
app.controller('VentaController', [VentaController]);
})();
