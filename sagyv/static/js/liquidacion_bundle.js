(function(){
'use strict';

var app = angular.module('liquidacionApp',[]),
    LiquidacionController = require('./controllers/liquidacion/liquidacion_controller.js'),
    ProductoController = require('./controllers/liquidacion/producto_controller.js'),
    GuiaPropiaController = require('./controllers/liquidacion/guia_propia_controller.js'),
    GuiaLipigasController = require('./controllers/liquidacion/guia_lipigas_controller.js'),
    VoucherLipigasController = require('./controllers/liquidacion/voucher_lipigas_controller.js'),
    VoucherTransbankController = require('./controllers/liquidacion/voucher_transbank_controller.js'),
    ChequeController = require('./controllers/liquidacion/cheque_controller.js'),
    CuponPrepagoController = require('./controllers/liquidacion/cupon_prepago_controller.js');

app.controller('LiquidacionController', ['$http','$scope', LiquidacionController]);
app.controller('ProductoController', ['$scope', ProductoController]);
app.controller('GuiaPropiaController', ['$http', '$scope', GuiaPropiaController]);
app.controller('GuiaLipigasController', ['$http', '$scope', GuiaLipigasController]);
app.controller('VoucherLipigasController', ['$http', '$scope', VoucherLipigasController]);
app.controller('VoucherTransbankController', ['$http', '$scope', VoucherTransbankController]);
app.controller('ChequeController', ['$http', '$scope', ChequeController]);
app.controller('CuponPrepagoController', ['$http', '$scope', CuponPrepagoController]);

})();

$('button[data-accion=abre_modal]').on('click', function(evt){
    $('#modal_' + $(this).data('modal')).modal('show');
});
