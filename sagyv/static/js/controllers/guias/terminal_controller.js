var Terminal = require('../../models/guias/terminal_model.js');

function TerminalController(service){
    this.service = service;

    this.terminales = [];
    this.terminal = null;
    this.index = null;

    this.init();
}

TerminalController.mixin({
    init: function(){
        var _this = this;

        this.service.findAll(function(data){

            data.terminales.forEach(function(t){
                var terminal = new Terminal();
                terminal.addData(t);
                _this.terminales.push(terminal);
            });
        });
    },

    procesarTerminales: function(data){
        var _this = this;

        data.terminales.forEach(function(){
            var terminal = new Terminal();
            _this.terminales.push(terminal);
        });
    },

    mostrarPanel: function(nombrePanel, param){
        this['_' + nombrePanel](param);
    },

    _agregar: function(){
        $('#modal_terminal_agregar').modal('show');
        this.terminal = new Terminal();
    },

    _asignar: function(index){
        this.index = index;

        $('#modal_terminal_asignar').modal('show');
        this.terminal = this.terminales[index];
        this.terminal.resetearMovil();
    },

    _editar: function(index){
        this.index = index;

        $('#modal_terminal_editar').modal('show');
        this.terminal = this.terminales[index];
    },

    agregar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.service.create(json, this.procesarAgregar.bind(this));
    },

    procesarAgregar: function(data){
        this.terminal.id = data.id;
        this.terminal.codigo = data.codigo;
        this.terminal.estado = data.estado;
        this.terminal.movil = data.movil;

        this.terminales.push(this.terminal);
        this.terminal = null;

        common.agregarMensaje('terminal agregado exitosamente');
        $('#modal_terminal_agregar').modal('hide');
    },

    remover: function(index){
        if(!confirm('Desea dar de baja la terminal ' + this.terminales[index].codigo)){
            return;
        }

        var terminal = this.terminales[index],
            _this = this;

        this.service.remove(terminal.id, function(){
            _this.terminales.splice(index, 1);
            common.agregarMensaje('terminal eliminada exitosamente');
        });
    },

    asignar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.terminales[this.index] = this.terminal;

        $('#modal_terminal_asignar').modal('hide');
        common.agregarMensaje('la asignación fue realizada exitosamente');
    },

    editar: function(){
        if(!this.terminal.esValido()){
            return;
        }

        var json = this.terminal.toJSON();
        this.service.edit(json, this.procesarEditar.bind(this));
    },

    procesarEditar: function(data){
        this.terminales[this.index] = this.terminal;

        $('#modal_terminal_editar').modal('hide');
        common.agregarMensaje('La terminal fue editada exitosamente');
    },

    maintenance:function(index){
    },

    returnMaintenance:function(index){
    },
});

module.exports = TerminalController;
