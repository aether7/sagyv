var Vehiculo = require('../../models/vehiculo/vehiculo_model.js');

function VehiculoController(service){
    this.service = service;
    this.vehiculos = [];
    this.vehiculo = null;
    this.index = null;

    this.init();
}

VehiculoController.mixin({
    init: function(){
        this.service.findAll(this.cargarLista.bind(this));
    },

    cargarLista: function(data){
        var _this = this;

        data.forEach(function(obj){
            var vehiculo = new Vehiculo();

            vehiculo.addData(obj);
            _this.vehiculos.push(vehiculo);
        });
    },

    mostrarNuevo: function(){
        $('#modal_nuevo_vehiculo').modal('show');
        this.vehiculo = new Vehiculo();
    },

    mostrarAnexar: function(index){
        this.index = index;

        $("#modal_anexar").modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    mostrarEditar: function(index){
        this.index = index;

        $('#modal_editar').modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    crearVehiculo: function(){
        if(!this.validarNumeroPatente()){
            return;
        }

        if(!this.vehiculo.esValido()){
            return;
        }

        if(this.vehiculo.chofer.id){
            this.vehiculo.chofer.nombre = $('#chofer_vehiculo_nuevo option:selected').text();
        }

        var json = this.vehiculo.toJSON();

        this.service.crearVehiculo(json, this.processAgregarVehiculo.bind(this));
    },

    validarNumeroPatente: function(){
        var self = this,
            preexistencia = true;

        this.vehiculo.mensaje.numero = null;
        this.vehiculo.mensaje.patente = null;

        preexistencia = this.vehiculos.forEach(function(v){
            if(v.chofer.id == self.vehiculo.chofer.id){
                v.chofer.id = null;
                v.chofer.nombre = "No anexado";
            }

            if(v.numero == self.vehiculo.numero){
                self.vehiculo.mensaje.numero = "La numeración ya existe";
                return false;
            }else if(v.patente.toUpperCase() == self.vehiculo.patente.toUpperCase()){
                self.vehiculo.mensaje.patente = "La patente ya existe";
                return false;
            }
        });

        return preexistencia;
    },

    actualizarVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        this.service.actualizarVehiculo(json, this.procesarEditarVehiculo.bind(this));
    },

    processAgregarVehiculo: function(data){
        this.vehiculos.push(this.vehiculo);
        this.vehiculo = null;

        $('#modal_nuevo_vehiculo').modal('hide');
        common.agregarMensaje('El vehículo fue creado exitosamente');
    },

    procesarEditarVehiculo: function(data){
        this.vehiculos[this.index] = this.vehiculo;

        $('#modal_editar').modal('hide');
        common.agregarMensaje('El vehículo fue actualizado exitosamente');
    },

    anexarChofer: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        this.vehiculo.chofer.nombre = $('#anexar_chofer option:selected').text();

        var json = this.vehiculo.toJSON();
        this.service.anexarChofer(json, this.processAnexarChofer.bind(this));
    },

    processAnexarChofer: function(data){
        this.vehiculos[this.index] = this.vehiculo;

        $("#modal_anexar").modal('hide');
        common.agregarMensaje('El vehículo fue anexado con trabajador exitosamente');
    },

});

module.exports = VehiculoController;
