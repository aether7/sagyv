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

    crearVehiculo: function(){
        console.log(this.vehiculo);
        console.log(this.vehiculo.toJSON());

        return;
        this.vehiculos.push(this.vehiculo);
        $('#modal_nuevo_vehiculo').modal('hide');
        common.agregarMensaje('El vehículo fue creado exitosamente');
    }
});

module.exports = VehiculoController;
