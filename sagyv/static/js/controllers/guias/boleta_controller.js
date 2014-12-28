var Boleta = require('../../models/guias/boleta_model.js');

function BoletaController(service){
    this.service = service;
    this.boletas = [];
    this.boleta = null;

    this.init();
}

BoletaController.mixin({
    init: function(){
        this.service.findAll(this.procesarBoletas.bind(this));
    },

    procesarBoletas: function(data){
        var _this = this;

        data.forEach(function(b){
            var boleta = new Boleta();
            boleta.inicial = b.inicial;
            boleta.ultima = b.ultima;
            boleta.actual = b.actual;
            boleta.trabajador = b.trabajador;
            _this.boletas.push(boleta);
        });
    },

    mostrarPanel: function(nombre, index){
        this['_' + nombre](index);
    },

    _nuevo: function(){
        console.log('nueva boleta');
        $('#modal_boleta_agregar').modal('show');
    },

    _editar: function(index){
        console.log('editar boleta');
    },

    eliminar: function(index){
        if(!confirm('¿Está seguro(a) de que desea realizar esta acción?')){
            return;
        }

        this.boletas.splice(index, 1);
        common.agregarMensaje('El talonario fue eliminado exitosamente');
    }
});

module.exports = BoletaController;
