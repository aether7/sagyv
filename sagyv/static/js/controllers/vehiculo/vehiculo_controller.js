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
        $("#modal_anexar").modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    mostrarEditar: function(index){
        this.index = index;

        $('#modal_editar').modal('show');
        this.vehiculo = this.vehiculos[index];
    },

    crearVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        this.service.crearVehiculo(json, this.processAgregarVehiculo.bind(this));
    },

    actualizarVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        console.log(json);

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
    },

    anexarChofer: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        this.service.anexarChofer(json, this.processAnexarChofer.bind(this));
    },

    processAnexarChofer: function(data){
        $("#modal_anexar").modal('hide');
    },

});

module.exports = VehiculoController;
