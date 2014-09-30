(function(){
'use strict';

var app = angular.module('trabajadorApp',[], App.httpProvider);

app.factory('trabajadorService', ['$http', function($http){
    var error, services;

    error = function(){
        alert('Ha ocurrido un error en el servicor');
    };

    services = {
        crear: function(param, callback){
            var action = App.urls.get('trabajador:crear');
            $.post(action, param).success(callback).error(error);
        },

        obtener: function(id, callback){
            var action = App.urls.get('trabajador:obtener') + '?id=' + id;
            $http.get(action).success(callback).error(error);
        },

        actualizar: function(params, callback){
            var action = App.urls.get('trabajador:actualizar');
            $.post(action, params).success(callback).error(error);
        },

        eliminar: function(id, callback){
            var action = App.urls.get('trabajador:eliminar'),
                json = { id : id };

            $.post(action, json, callback).error(error);
        },

        guardarBoleta: function(json, callback){
            var url = App.urls.get('trabajador:guardar_boleta');
            $.post(url, json).success(callback).error(error);
        },

        buscarBoleta: function(id, callback){
            var url = App.urls.get('trabajador:buscar_boleta');
            url += '?id=' + id;

            $http.get(url).success(callback).error(error);
        }
    };

    return services;
}]);

function TrabajadorController(service){
    this.service = service;
    this.trabajador = new App.Models.Trabajador();
    this.boleta = new App.Models.Boleta();
}

TrabajadorController.mixin({
    mostrar: function(){
        this.trabajador = new App.Models.Trabajador();
        common.mostrarModal('nuevo');
    },

    crearTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        if(existeTrabajador(this.trabajador.rut)){
            this.trabajador.mensajes.rut = 'El rut está siendo utilizado por otro trabajador';
            return;
        }

        var json = this.trabajador.getJSON();
        this.service.crear(json, this.renderNuevoTrabajador);
    },

    renderNuevoTrabajador: function(data){
        var html,
            tpl = $('#tpl_nuevo_trabajador').html(),
            fx = Handlebars.compile(tpl);

        html = fx(data);
        $('#lista_trabajadores tbody').append(html);

        $('#modal_nuevo').modal('hide');
        common.agregarMensaje('El trabajador ha sido creado exitosamente');
    },

    verTrabajador: function(id){
        var _this = this;
        this.trabajador = new App.Models.Trabajador();

        this.service.obtener(id, function(data){
            common.mostrarModal('ver');
            _this.procesarTrabajador(data);
        })
    },

    editarTrabajador: function(id){
        var _this = this;
        this.trabajador = new App.Models.Trabajador();

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

    eliminarTrabajador: function(id){
        if(!confirm('¿Esta seguro(a) de realizar esta acción ?')){
            return;
        }

        this.service.eliminar(id, function(data){
            $('#lista_trabajadores tr[data-id={0}]'.format(id)).remove();
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

    anexarBoleta: function(id){
        var _this = this;
        this.boleta = new App.Models.Boleta();

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

app.controller('TrabajadorController',['trabajadorService', TrabajadorController]);

})();


function existeTrabajador(rut){
    var duplicado = false;

    $('#lista_trabajadores tbody tr[data-id] td[data-campo=rut]').each(function(){
        if(rut === $(this).text().trim()){
            duplicado = true;
        }
    });

    return duplicado;
}
