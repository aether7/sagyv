function TerminalController(service){
    this.service = service;

    this.terminal = {};
    this.mensajes = {};
    this.terminales = [];

    this.init();
}

TerminalController.mixin({
    init: function(){
        var _this = this;

        this.service.findAll(function(data){
            _this.terminales = data.terminales;
        });
    },

    mostrarPanel: function(){
        this.terminal = {};
        this.mensajes = {};

        $('#modal_terminal_agregar').modal('show');
        console.log('mostrando panel');
    },

    agregar: function(){
        var valido = true,
        _this = this;

        this.mensajes = {};

        if(!this.terminal.numero){
            this.mensajes.numero = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.terminal.numero)){
            this.mensajes.numero = 'número inválido';
            valido = false;
        }

        if(!this.terminal.vehiculo){
            this.mensajes.vehiculo = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            return;
        }

        console.log(this.terminal);
        this.service.create(this.terminal, function(data){
            _this.terminales = data.terminales;
            common.agregarMensaje('terminal agregado exitosamente');
            $('#modal_terminal_agregar').modal('hide');
        });

    },

    editar: function(index){
        console.log('editando terminal');
    },

    remover: function(index){
        console.log('removiendo terminal');
    }
});

module.exports = TerminalController;
