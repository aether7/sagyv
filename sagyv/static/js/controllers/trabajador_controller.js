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

        if(existeTrabajador(this.trabajador.rut)){
            this.trabajador.mensajes.rut = "El rut está siendo utilizado por otro trabajador";
            return;
        }

        var action = App.urls.get("trabajador:crear"),
            json = this.trabajador.getJSON();

        $.post(action, json, this.renderNuevoTrabajador);
    },

    renderNuevoTrabajador: function(data){
        var html,
            tpl = $("#tpl_nuevo_trabajador").html(),
            fx = Handlebars.compile(tpl);

        html = fx(data);
        $("#lista_trabajadores tbody").append(html);

        $("#modal_nuevo").modal("hide");
        common.agregarMensaje("El trabajador ha sido creado exitosamente");
    },

    verTrabajador: function(id){
        var action = App.urls.get("trabajador:obtener"),
            _this = this;

        action += "?id=" + id;

        this.trabajador = new App.Models.Trabajador();

        this.http.get(action).success(function(data){
            common.mostrarModal("ver");
            _this.procesarTrabajador(data);
        });
    },

    editarTrabajador: function(id){
        var action = App.urls.get("trabajador:obtener"),
            _this = this;

        this.trabajador = new App.Models.Trabajador();
        action += "?id=" + id;

        this.http.get(action).success(function(data){
            common.mostrarModal("editar");

            _this.procesarTrabajador(data, "id");
            _this.trabajador.id = id;
        });
    },

    actualizarTrabajador: function(){
        if(!this.trabajador.esValido()){
            return;
        }

        var action = App.urls.get("trabajador:actualizar"),
            json = this.trabajador.getJSON(),
            _this = this;

        $.post(action, json, this.renderActualizarTrabajador);
    },

    renderActualizarTrabajador: function(data){
        var tr = $("#lista_trabajadores tr[data-id={0}]".format(data.id));

        tr.find("td[data-campo=nombre]").text(data.nombre);
        tr.find("td[data-campo=apellido]").text(data.apellido);
        tr.find("td[data-campo=rut]").text(data.rut);
        tr.find("td[data-campo=estado_vacaciones]").text(data.estado_vacaciones);

        $("#modal_editar").modal("hide");
        common.agregarMensaje("El trabajador ha sido editado exitosamente");
    },

    eliminarTrabajador: function(id){
        if(!confirm("¿Esta seguro(a) de realizar esta acción ?")){
            return;
        }

        var action = App.urls.get("trabajador:eliminar"),
            json = { id : id };

        $.post(action, json, function(data){
            $("#lista_trabajadores tr[data-id={0}]".format(id)).remove();
            common.agregarMensaje("El trabajador se ha eliminado exitosamente");
        });
    },

    procesarTrabajador: function(data, campo){
        campo = campo || "nombre";

        var fechaNac = new Date(common.fecha.agregarCeros(data.nacimiento) + " 00:00:00"),
            fechaInicio = new Date(common.fecha.agregarCeros(data.fecha_inicio_contrato) + " 00:00:00"),
            fechaVigencia = new Date(common.fecha.agregarCeros(data.vigencia_licencia) + " 00:00:00");

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
    }
};

app.controller("TrabajadorController",["$http", TrabajadorController]);

})();


function existeTrabajador(rut){
    var duplicado = false;

    $("#lista_trabajadores tbody tr[data-id] td[data-campo=rut]").each(function(){
        if(rut === $(this).text().trim()){
            duplicado = true;
        }
    });

    return duplicado;
}
