(function(){
"use strict";

var app = angular.module("trabajadorApp",[]);

function TrabajadorController($http){
    this.trabajador = new App.Models.Trabajador();
    this.http = $http;
}

TrabajadorController.prototype = {
    constructor: TrabajadorController,

    mostrar: function(){
        this.trabajador = new App.Models.Trabajador();
        common.mostrarModal("nuevo");
    },

    crearTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        var action = App.urls.get("trabajador:crear"),
            json = this.trabajador.getJSON();

        $.post(action, json, function(data){
            var html,
                tpl = $("#tpl_nuevo_trabajador").html(),
                fx = Handlebars.compile(tpl);

            html = fx(data);
            $("#lista_trabajadores tbody").append(html);

            $("#modal_nuevo").modal("hide");
            common.agregarMensaje("El trabajador ha sido creado exitosamente");
        });
    },

    verTrabajador: function(id){
        var action = App.urls.get("trabajador:obtener"),
            _this = this;

        action += "?id=" + id;

        this.http.get(action).success(function(data){
            common.mostrarModal("ver");
            _this.procesarTrabajador(data);
        });
    },

    editarTrabajador: function(id){
        var action = App.urls.get("trabajador:obtener"),
            _this = this;

        action += "?id=" + id;

        this.http.get(action).success(function(data){
            common.mostrarModal("editar");
            _this.procesarTrabajador(data, "id");
        });
    },

    actualizarTrabajador: function(){
        if(!trabajador.esValido()){
            return;
        }

        var action = App.urls.get("trabajador:actualizar"),
            json = this.trabajador.getJSON(),
            _this = this;

        $.post(action, json, function(data){
            common.agregarMensaje("El trabajador ha sido editado exitosamente");
        });
    },

    procesarTrabajador: function(data, campo){
        campo = campo || "nombre";

        this.trabajador = new App.Models.Trabajador();
        this.trabajador.nombre = data.nombre;
        this.trabajador.apellido = data.apellido;
        this.trabajador.rut = data.rut;
        this.trabajador.domicilio = data.domicilio;
        this.trabajador.fechaNacimiento = data.nacimiento;
        this.trabajador.inicioContrato = data.fecha_inicio_contrato;
        this.trabajador.vigenciaLicencia = data.vigencia_licencia;
        this.trabajador.afp = data.afp[campo];
        this.trabajador.sistemaSalud = data.sistema_salud[campo];
        this.trabajador.estadoCivil = data.estado_civil[campo];
        this.trabajador.estadoVacacion = data.estado_vacacion[campo];
    }
};

app.controller("TrabajadorController",["$http", TrabajadorController]);

})();
