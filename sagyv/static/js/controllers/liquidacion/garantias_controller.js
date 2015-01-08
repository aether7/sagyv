var Producto = require('./../../models/liquidacion/producto_model.js'),
    VentaPropia = require('./../../models/liquidacion/garantias_model.js');
    //guias = require('./mixins.js').guias;

function GarantiasController($scope, service){
    this.service = service;
    this.scope = $scope;
    //some Vars this
}

GarantiasController.mixin({
    resetearGarantias : function(){
        alert('alive');
    },

    guardar : function(){
        alert('some');
    }
});

module.exports = GarantiasController;
