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
        this.boleta = new Boleta();
        $('#modal_boleta_agregar').modal('show');
    },

    _editar: function(index){
        this.boleta = this.boletas[index];
        $('#modal_boleta_editar').modal('show');
    },

    agregar: function(){
        if(!this.boleta.esValido()){
            return;
        }else if(this.estaDuplicadoTrabajador(this.boleta)){
            this.boleta.mensajes.trabajador = 'El trabajador ya tiene otro talonario anexado';
            return;
        }

        this.boleta.trabajador.nombre = $('#boleta_agregar_trabajador option:selected').text();

        var json = this.boleta.toJSON();
        this.service.agregar(json, this.procesarAgregar.bind(this));
    },

    estaDuplicadoTrabajador: function(){
        var trabajadorSeleccionado = $('#boleta_agregar_trabajador option:selected').text(),
            trabajadoresAsignados = this.boletas.filter(function(boleta){
                return boleta.trabajador.nombre === trabajadorSeleccionado;
            });

        return trabajadoresAsignados.length;
    },

    procesarAgregar: function(data){
        this.boletas.push(this.boleta);

        common.agregarMensaje('El talonario ha sido creado exitosamente');
        $('#modal_boleta_agregar').modal('hide');
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
