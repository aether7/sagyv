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

    abrir : function(){
        var prods = this.scope.productos,
            self = this;

        if(prods == undefined){
            return
        }

        prods.forEach(function(p){
            cod = p.codigo;
            if((cod == 1105) ||(cod == 1405)){
                self.garantias[0].max += p.vacios

            }else if((cod == 1111) ||(cod == 1411)){
                self.garantias[1].max += p.vacios

            }else if((cod == 1115) ||(cod == 1415)){
                self.garantias[2].max += p.vacios

            }else if((cod == 1145) ||(cod == 1445)){
                self.garantias[3].max += p.vacios

            }
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
