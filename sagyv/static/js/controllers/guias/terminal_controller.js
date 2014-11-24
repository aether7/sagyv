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

    mostrarPanelAsignar: function(index){
        this.mensajes = {};
        this.terminal = this.terminales[index];
        this.terminal.vehiculoAsignado = null;
        console.log(this.terminal);
        $('#modal_terminal_asignar').modal('show');
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

    asignar: function(){
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

        if(!this.terminal.vehiculoAsignado){
            this.mensajes.vehiculoAsignado = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            return;
        }
        this.terminal.vehiculo = this.terminal.vehiculoAsignado;

        this.service.create(this.terminal, function(data){
            _this.terminales = data.terminales;
            common.agregarMensaje('terminal agregado exitosamente');
            $('#modal_terminal_agregar').modal('hide');
        });
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
