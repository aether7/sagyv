var Cliente = require('../../models/cliente/cliente_model.js');

function ClienteController(service, rootScope){
    this.scope = rootScope;
    this.service = service;
    this.index = null;
    this.clientes = [];
    this.cliente = null;
    this.init();
}

ClienteController.prototype = {
    constructor: ClienteController,
    init: function(){
        var _this = this;

        this.service.all(function(data){
            _this.clientes = data.map(function(c){
                var cliente = new Cliente();

                cliente.setSituacionComercial(c.situacionComercial);
                cliente.id = c.id;
                cliente.nombre = c.nombre;
                cliente.giro = c.giro;
                cliente.rut = c.rut;
                cliente.direccion = c.direccion;
                cliente.telefono = c.telefono;
                cliente.propio = c.propio;
                cliente.lipigas = c.lipigas;
                cliente.dispensador = c.dispensador;
                cliente.credito = c.credito;
                cliente.observacion = c.observacion;

                return cliente;
            });
        });
    },

    nuevo: function(){
        this.cliente = new Cliente();
        $('#modal_agregar').modal('show');
    },

    editar: function(index){
        this.index = index;
        this.cliente = this.clientes[index];
        $('#modal_editar').modal('show');
    },

    eliminar: function(index){
        if(!confirm('¿ Está seguro(a) de eliminar a este cliente ?')){
            return;
        }

        var cliente = this.clientes[index],
            _this = this;

        this.service.remove(cliente.id, function(){
            _this.clientes.splice(index, 1);
            common.agregarMensaje('El cliente fue eliminado exitosamente');
        });
    },

    ver: function(index){
        this.cliente = this.clientes[index];
        $('#modal_ver').modal('show');
    },

    crear: function(){
        if(!this.cliente.esValido()){
            return;
        }

        this.service.create(this.cliente.toJSON(), this.procesarCrear.bind(this));
    },

    procesarCrear: function(data){
        this.cliente.id = data.id;
        this.clientes.push(this.cliente);

        $('#modal_agregar').modal('hide');
        common.agregarMensaje('El cliente fue agregado exitosamente');
    },

    actualizar: function(){
        if(!this.cliente.esValido()){
            return;
        }

        this.service.update(this.cliente.toJSON(), this.procesarActualizar.bind(this));
    },

    procesarActualizar: function(data){
        this.clientes[this.index] = this.cliente;

        $('#modal_editar').modal('hide');
        common.agregarMensaje('El cliente ha sido actualizado exitosamente');
    }
};

module.exports = ClienteController;
