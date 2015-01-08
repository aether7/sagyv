var Garantias = require('./../../models/liquidacion/garantias_model.js');

function GarantiasController($scope, service){
    this.scope = $scope;
    this.service = service;

    this.garantias = [];
    this.garantia = null;

    this.init();
}

GarantiasController.prototype = {
    constructor: GarantiasController,

    init : function(){
        this.service.obtenerGarantias(this.procesarGarantias.bind(this));
    },

    procesarGarantias : function(data){
        var self = this;

        data.forEach(function(e){
            self.garantia = new Garantias();
            self.garantia.id = e.id;
            self.garantia.codigo = e.codigo;
            self.garantia.valor = e.precio;

            self.garantias.push(self.garantia);
        });
    },

    guardar : function(){
        var valido = true, output = [];

        this.garantias.forEach(function(g){
            if(!g.esValido()){
                valido = false;
            }

            output.push(g.getJSON());
        });

        if(!valido){
            return;
        }

        $('#modal_garantias').modal('hide');
        $("#venta_garantias_ls").val(JSON.stringify(output));
    }
};

module.exports = GarantiasController;
