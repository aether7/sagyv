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
        var _this = this,
            confirmacion = confirm("Desea dar de baja la terminal " + _this.terminales[index].codigo);
        if (confirmacion == true) {
            this.service.remove(_this.terminales[index].id, function(data){
                _this.terminales.splice(index, 1);
                common.agregarMensaje('terminal dada de baja exitosamente');
            });
        }
    },

    maintenance:function(index){
        var _this = this,
            confirmacion = confirm("Desea enviar a mantención la terminal " + _this.terminales[index].codigo);
        if (confirmacion == true) {
            this.service.maintenance(_this.terminales[index].id, function(data){
                _this.terminales[index] = data;
                common.agregarMensaje('terminal envidada a mantención exitosamente');
            });
        }
    }
});

module.exports = TerminalController;
