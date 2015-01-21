(function(){
'use strict';

var app = angular.module('liquidacionApp',[]),
    PanelBusquedaController = require('../controllers/liquidacion/panel_busqueda_controller.js'),
    LiquidacionController = require('../controllers/liquidacion/liquidacion_controller.js'),
    ProductoController = require('../controllers/liquidacion/producto_controller.js'),
    GuiaPropiaController = require('../controllers/liquidacion/guia_propia_controller.js'),
    GuiaLipigasController = require('../controllers/liquidacion/guia_lipigas_controller.js'),
    VoucherLipigasController = require('../controllers/liquidacion/voucher_lipigas_controller.js'),
    VoucherTransbankController = require('../controllers/liquidacion/voucher_transbank_controller.js'),
    ChequeController = require('../controllers/liquidacion/cheque_controller.js'),
    CuponPrepagoController = require('../controllers/liquidacion/cupon_prepago_controller.js'),
    OtroController = require('../controllers/liquidacion/otro_controller.js'),
    GarantiasController = require('../controllers/liquidacion/garantias_controller.js'),
    liquidacionService = require('../services/liquidacion_service.js');

app.factory('liquidacionService', liquidacionService);
app.factory('mantieneRestanteService',function(){
    var hash = {}, calculaRestantes;

    calculaRestantes = function(p, index){
        if(typeof p.disponibles === 'undefined'){
            p.disponibles = parseInt(p.vacios);
        }

        hash[p.codigo] = { index: index, disponibles: p.disponibles };
        return p;
    };

    return {
        calculaRestantes: function(arr){
            arr.map(calculaRestantes);
            return arr;
        },

        restar: function(productos, arr){
            arr.forEach(function(a){
                hash[a.codigo].disponibles -= parseInt(a.cantidad);
            });

            productos.map(function(p){
                var disponibles = parseInt(hash[p.codigo].disponibles);
                p.disponibles = disponibles;
                return p;
            });

            return productos;
        },

        tieneStockDisponible: function(codigo, cantidad){
            var obj = hash[codigo];
            return parseInt(obj.disponibles) >= parseInt(cantidad);
        }
    };
});

app.factory('ExistenciasGarantiasService', function(){
    var existencias = {}, somefunction;

    somefunction = function(){
        console.log('hola');
    };

    return {
        some : function(){
            console.log('inreturn');
        }
    }
});

app.controller('PanelBusquedaController', ['$scope', 'liquidacionService', PanelBusquedaController]);
app.controller('LiquidacionController', ['$scope', 'liquidacionService', LiquidacionController]);
app.controller('ProductoController', ['$scope', ProductoController]);
app.controller('GuiaPropiaController', ['$scope', 'liquidacionService','mantieneRestanteService', GuiaPropiaController]);
app.controller('GuiaLipigasController', ['$scope', 'liquidacionService','mantieneRestanteService', GuiaLipigasController]);
app.controller('VoucherLipigasController', ['$scope', VoucherLipigasController]);
app.controller('VoucherTransbankController', ['$scope', VoucherTransbankController]);
app.controller('ChequeController', ['$scope', ChequeController]);
app.controller('CuponPrepagoController', ['$scope', 'mantieneRestanteService', CuponPrepagoController]);
app.controller('OtroController', ['$scope', OtroController]);
app.controller('GarantiasController', ['$scope', 'liquidacionService', GarantiasController]);

})();

$('button[data-accion=abre_modal]').on('click', function(evt){
    $('#modal_' + $(this).data('modal')).modal('show');
});
