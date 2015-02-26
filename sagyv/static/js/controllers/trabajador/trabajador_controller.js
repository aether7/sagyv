var Trabajador = require('../../models/trabajador/trabajador_model.js'),
    Boleta = require('../../models/trabajador/boleta_model.js');

function TrabajadorController(service){
    this.service = service;
    this.trabajadores = [];
    this.trabajador = new Trabajador();
    this.boleta = new Boleta();
    this.index = null;

    this.init();
}

TrabajadorController.prototype = {
    constructor: TrabajadorController,

    init: function(){
        var _this = this;

        this.service.findAll(function(data){
            _this.trabajadores = data.map(function(obj){
                var trabajador = new Trabajador();

                trabajador.id = obj.id;
                trabajador.nombre = obj.nombre;
                trabajador.apellido = obj.apellido;
                trabajador.rut = obj.rut;
                trabajador.domicilio = obj.domicilio;
                trabajador.fechaNacimiento = common.fecha.jsonToDate(obj.nacimiento);
                trabajador.inicioContrato = common.fecha.jsonToDate(obj.fechaInicioContrato);
                trabajador.vigenciaLicencia = common.fecha.jsonToDate(obj.vigenciaLicencia);
                trabajador.afp = obj.afp;
                trabajador.sistemaSalud = obj.sistemaSalud;
                trabajador.estadoCivil = obj.estadoCivil;
                trabajador.estadoVacacion = obj.estadoVacacion;
                trabajador.tipo = obj.tipo;

                return trabajador;
            });
        });
    },

    mostrar: function(){
        this.trabajador = new Trabajador();
        common.mostrarModal('nuevo');
    },

    crearTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        if(this.existeTrabajador(this.trabajador)){
            this.trabajador.mensajes.rut = 'El rut está siendo utilizado por otro trabajador';
            return;
        }

        var json = this.trabajador.getJSON();
        this.service.crear(json, this.renderNuevoTrabajador.bind(this));
    },

    existeTrabajador: function(trabajador){
        var resultado = this.trabajadores.filter(function(t){
            return t.rut === trabajador.rut;
        });

        return resultado.length;
    },

    renderNuevoTrabajador: function(data){
        this.trabajador.id = data.id;
        this.trabajador.estadoVacacion = data.estadoVacacion;
        this.trabajador.estadoCivil = data.estadoCivil;
        this.trabajador.afp = data.afp;
        this.trabajador.sistemaSalud = data.sistemaSalud;

        this.trabajadores.push(this.trabajador);

        $('#modal_nuevo').modal('hide');
        common.agregarMensaje('El trabajador ha sido creado exitosamente');
    },

    verTrabajador: function(index){
        var _this = this;
        this.trabajador = this.trabajadores[index];

        this.service.obtener(this.trabajador.id, function(data){
            _this.trabajador.boleta.boletaInicial = data.boleta.boletaInicial
            _this.trabajador.boleta.boletaActual = data.boleta.boletaActual
            _this.trabajador.boleta.boletaFinal = data.boleta.boletaFinal
            common.mostrarModal('ver');
        });
    },

    editarTrabajador: function(index){
        var _this = this,
            trabajador = this.trabajadores[index];

        this.index = index;
        this.trabajador = trabajador;
        common.mostrarModal('editar');
    },

    actualizarTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        this.service.actualizar(this.trabajador.getJSON(), this.renderActualizarTrabajador.bind(this));
    },

    renderActualizarTrabajador: function(data){
        $('#modal_editar').modal('hide');
        common.agregarMensaje('El trabajador ha sido editado exitosamente');
    },

    eliminarTrabajador: function(index){
        if(!confirm('¿Esta seguro(a) de realizar esta acción ?')){
            return;
        }

        var trabajador = this.trabajadores[index],
            id = trabajador.id,
            _this = this;

        this.service.eliminar(id, function(data){
            _this.trabajadores.splice(index, 1);
            common.agregarMensaje('El trabajador se ha eliminado exitosamente');
        });
    },

    anexarBoleta: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.boleta = new Boleta();

        this.service.buscarBoleta(id, function(data){
            _this.boleta.numeroAnterior = data.boletaActual;
            _this.boleta.boletaInicial = data.boletaFinal + 1;
            _this.boleta.boletaFinal = data.boletaFinal + 2;
            _this.boleta.id = id;

            $('#modal_anexar_boleta').modal('show');
        });
    },

    guardarTalonario: function(){
        if(!this.boleta.esValida()){
            return;
        }

        var json = this.boleta.getJSON();

        this.service.guardarBoleta(json, function(data){
            $('#modal_anexar_boleta').modal('hide');
            common.agregarMensaje('Se ha anexado el talonario de boletas al trabajador exitosamente');
        });
    }
};

module.exports = TrabajadorController;
