var Vehiculo = require('../../models/vehiculo/vehiculo_model.js');

function VehiculoController(service){
    this.service = service;
    this.vehiculos = [];
    this.vehiculo = null;

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

    mostrarEditar: function(index){
        $('#modal_editar').modal('show');
        this.vehiculo = this.vehiculos[index];
        console.log(this.vehiculo.estadoSec);
        console.log(this.vehiculo.estadoPago);
    },

    crearVehiculo: function(){
        if(!this.vehiculo.esValido()){
            return;
        }

        var json = this.vehiculo.toJSON();
        this.service.crearVehiculo(json, this.processAgregarVehiculo.bind(this));
    },

    processAgregarVehiculo: function(data){
        console.log(data);

        this.vehiculos.push(this.vehiculo);
        this.vehiculo = null;
        $('#modal_nuevo_vehiculo').modal('hide');
        common.agregarMensaje('El vehículo fue creado exitosamente');
    }
});

module.exports = VehiculoController;
