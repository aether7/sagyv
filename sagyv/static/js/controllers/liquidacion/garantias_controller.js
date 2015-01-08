var Producto = require('./../../models/liquidacion/producto_model.js'),
    Garantias = require('./../../models/liquidacion/garantias_model.js');

function GarantiasController($scope, service){
    this.service = service;
    this.scope = $scope;

    this.garantia = null;
    this.garantias = [];

    this.valido = true;
    this.init();
}

GarantiasController.mixin({
    init : function(){
        this.service.obtenerGarantias({}, this.procesarGarantias.bind(this));
    },

    procesarGarantias : function(data){
        self = this;

        data.forEach(function(e){
            self.garantia = new Garantias();
            self.garantia.id = e.id;
            self.garantia.codigo = e.codigo;
            self.garantia.valor = e.precio;

            self.garantias.push(self.garantia);
        });

    },

    resetearGarantias : function(){},

    guardar : function(){
        //TODO : que haga algo(?)
        self = this;
        this.garantias.forEach(function(g){
            if(!g.esValido()){
                self.valido = false;
            }
        });

        if(!this.valido){
            console.log('NOPE');
            return
        }

        console.log('YEE');
    }
});

module.exports = GarantiasController;
