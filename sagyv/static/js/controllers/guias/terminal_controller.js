var Terminal = require('../../models/guias/terminal_model.js');

function TerminalController(service){
    this.service = service;

    this.terminales = [];
    this.terminal = null;

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

    mostrarPanelAsignar: function(index){
        this.mensajes = {};
        this.terminal = this.terminales[index];
        this.terminal.vehiculoAsignado = null;
        $('#modal_terminal_asignar').modal('show');
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
        var valido = true,
        _this = this;

        this.mensajes = {};

        if(!this.terminal.vehiculoAsignado){
            this.mensajes.vehiculoAsignado = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            console.log(this.mensajes.vehiculoAsignado);
            return;
        }

        this.terminal.vehiculo = this.terminal.vehiculoAsignado;
        console.log(this.terminal);

        this.service.asignar(this.terminal, function(data){
            _this.terminales = data.terminales;
            common.agregarMensaje('terminal agregado exitosamente');
            $('#modal_terminal_asignar').modal('hide');
        });
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
    },

    returnMaintenance:function(index){
        var _this = this,
            confirmacion = confirm("Desea reincorporar la terminal " + _this.terminales[index].codigo);
        if(confirmacion == true){
            this.service.returnMaintenance(_this.terminales[index].id, function(data){
                _this.terminales[index] = data;
                common.agregarMensaje('La terminar a retornado de mantenimiento');
            });
        }
    },
});

module.exports = TerminalController;
