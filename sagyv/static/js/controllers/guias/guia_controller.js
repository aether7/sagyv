var Guia = require('../../models/guias/guia_model.js');

function GuiaController(service){
    this.service = service;
    this.guias = [];
    this.guia = null;

    this.init();
}

GuiaController.mixin({
    init: function(){
        this.service.findAll(this.procesarGuias.bind(this));
    },

    procesarGuias: function(data){
        var _this = this;

        data.forEach(function(d){
            var guia = new Guia();
            guia.inicial = d.inicial;
            guia.ultima = d.ultima;
            guia.actual = d.actual;
            guia.trabajador = d.trabajador;
            _this.guias.push(guia);
        });
    },

    mostrarPanel: function(nombre, index){
        this['_' + nombre](index);
    },

    _nuevo: function(){
        this.guia = new Guia();
        $('#modal_guia_agregar').modal('show');
    },

    _editar: function(){
        console.warn('WIP');
    },

    agregar: function(){
        if(!this.guia.esValido()){
            return;
        }else if(this.estaDuplicadoTrabajador(this.guia)){
            this.guia.mensajes.trabajador = 'El trabajador ya tiene otro talonario de guías anexado';
            return;
        }

        this.guia.trabajador.nombre = $('#guia_agregar_trabajador option:selected').text();

        var json = this.guia.toJSON();
        this.service.agregar(json, this.procesarAgregar.bind(this));
    },

    estaDuplicadoTrabajador: function(){
        var trabajadorSeleccionado = $('#guia_agregar_trabajador option:selected').text(),
            trabajadoresAsignados = this.guias.filter(function(guia){
                return guia.trabajador.nombre === trabajadorSeleccionado;
            });

        return trabajadoresAsignados.length;
    },

    procesarAgregar: function(data){
        this.guia.id = data.id;
        this.guias.push(this.guia);

        common.agregarMensaje('La guía fue creada exitosamente');
        $('#modal_guia_agregar').modal('hide');
    }
});

module.exports = GuiaController;
