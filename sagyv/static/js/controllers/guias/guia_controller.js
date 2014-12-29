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
        }

        console.warn('WIP');
    }
});

module.exports = GuiaController;
