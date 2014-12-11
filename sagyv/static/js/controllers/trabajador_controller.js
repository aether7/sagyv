var Trabajador = require('../models/trabajador/trabajador_model.js'),
    Boleta = require('../models/trabajador/boleta_model.js');

function TrabajadorController(service){
    this.service = service;
    this.trabajadores = [];
    this.trabajador = new Trabajador();
    this.boleta = new Boleta();

    this.init();
}

TrabajadorController.mixin({
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
                trabajador.inicioContrato = common.fecha.jsonToDate(obj.inicioContrato);
                trabajador.vigenciaLicencia = common.fecha.jsonToDate(obj.vigenciaLicencia);
                trabajador.afp = obj.afp;
                trabajador.sistemaSalud = obj.sistemaSalud;
                trabajador.estadoCivil = obj.estadoCivil;
                trabajador.estadoVacacion = obj.estadoVacacion;

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
        this.trabajadores.push(this.trabajador);

        $('#modal_nuevo').modal('hide');
        common.agregarMensaje('El trabajador ha sido creado exitosamente');
    },

    verTrabajador: function(index){
        var _this = this;
        this.trabajador = this.trabajadores[index];

        this.service.obtener(this.trabajador.id, function(data){
            _this.trabajador.boleta.boletaInicial = data.boleta.boleta_inicial
            _this.trabajador.boleta.boletaActual = data.boleta.boleta_actual
            _this.trabajador.boleta.boletaFinal = data.boleta.boleta_final
            common.mostrarModal('ver');
        });
    },

    editarTrabajador: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.trabajador = new Trabajador();

        this.service.obtener(id, function(data){
            common.mostrarModal('editar');

            _this.procesarTrabajador(data, 'id');
            _this.trabajador.id = id;
        });
    },

    actualizarTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        this.service.actualizar(this.trabajador.getJSON(), this.renderActualizarTrabajador);
    },

    renderActualizarTrabajador: function(data){
        var tr = $('#lista_trabajadores tr[data-id={0}]'.format(data.id));

        tr.find('td[data-campo=nombre]').text(data.nombre);
        tr.find('td[data-campo=apellido]').text(data.apellido);
        tr.find('td[data-campo=rut]').text(data.rut);
        tr.find('td[data-campo=estado_vacaciones]').text(data.estado_vacaciones);

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

    procesarTrabajador: function(data, campo){
        campo = campo || 'nombre';

        var fechaNac = new Date(common.fecha.agregarCeros(data.nacimiento) + ' 00:00:00'),
            fechaInicio = new Date(common.fecha.agregarCeros(data.fecha_inicio_contrato) + ' 00:00:00'),
            fechaVigencia = new Date(common.fecha.agregarCeros(data.vigencia_licencia) + ' 00:00:00');

        this.trabajador.nombre = data.nombre;
        this.trabajador.apellido = data.apellido;
        this.trabajador.rut = data.rut;
        this.trabajador.domicilio = data.domicilio;
        this.trabajador.fechaNacimiento = fechaNac;
        this.trabajador.inicioContrato = fechaInicio;
        this.trabajador.vigenciaLicencia = fechaVigencia;
        this.trabajador.afp = data.afp[campo];
        this.trabajador.sistemaSalud = data.sistema_salud[campo];
        this.trabajador.estadoCivil = data.estado_civil[campo];
        this.trabajador.estadoVacacion = data.estado_vacacion[campo];
        this.trabajador.boleta.boletaInicial = data.boleta.boleta_inicial;
        this.trabajador.boleta.boletaFinal = data.boleta.boleta_final;
        this.trabajador.boleta.boletaActual = data.boleta.boleta_actual;
    },

    anexarBoleta: function(index){
        var _this = this,
            trabajador = this.trabajadores[index],
            id = trabajador.id;

        this.boleta = new Boleta();

        this.service.buscarBoleta(id, function(data){
            _this.boleta.numeroAnterior = data.boleta_actual;
            _this.boleta.boletaInicial = data.boleta_final + 1;
            _this.boleta.boletaFinal = data.boleta_final + 2;
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
});

module.exports = TrabajadorController;
