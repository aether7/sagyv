App.Controllers.Trabajador = function(){
    this.fNuevo = $("#f_nuevo");
    this.btnNuevo = $("#btn_nuevo_trabajador");
    this.urlObtenerTrabajador = null;
};

App.Controllers.Trabajador.prototype = {
    constructor: App.Controllers.Trabajador,

    init: function(){
        var _this = this;

        this.btnNuevo.on("click", function(){
            common.mostrarModal("nuevo");
        });

        this.fNuevo.on("submit", function(evt){
            evt.preventDefault();
            _this.guardarNuevo($(this).attr("action"), $(this));
        });

        $("#lista_trabajadores").on("click", "a[data-accion]", function(evt){
            evt.preventDefault();
            var accion = $(this).data("accion");
            common.mostrarModal(accion);
            _this.cargarDetalleTrabajador($(this).data("id"));
        });
    },

    cargarDetalleTrabajador: function(id){
        $.get(this.urlObtenerTrabajador,{ id : id }, function(data){
            console.log(data);

            $("#nombre_ver").text(data.nombre);
            $("#apellido_ver").text(data.apellido);
            $("#rut_ver").text(data.rut);
            $("#domicilio_ver").text(data.domicilio);
            $("#fecha_nacimiento_ver").text(data.nacimiento);
            $("#inicio_contrato_ver").text(data.fecha_inicio_contrato);
            $("#vigencia_licencia_ver").text(data.vigencia_licencia);
            $("#afp_ver").text(data.afp);
            $("#sistema_salud_ver").text(data.sistema_salud);
            $("#estado_civil_ver").text(data.estado_civil);
        });
    },

    guardarNuevo: function(action, $form){
        var nombre = $("#nombre_add"),
            apellido = $("#apellido_add"),
            rut = $("#rut_add"),
            domicilio = $("#domicilio_add"),
            fechaNacimiento = $("#fecha_nacimiento_add"),
            inicioContrato = $("#inicio_contrato_add"),
            vigenciaLicencia = $("#vigencia_licencia_add"),
            afp = $("#afp_add"),
            sistemaSalud = $("#sistema_salud_add"),
            estadoCivil = $("#estado_civil_add"),
            estadoVacacion = $("#estado_vacacion_add"),
            valido = true,
            _this = this;

        valido = this.validarCampos(nombre, apellido, rut, domicilio, fechaNacimiento,
            inicioContrato, vigenciaLicencia, afp, sistemaSalud, estadoCivil, estadoVacacion);

        if(!valido){
            return;
        }

        $.post(action, $form.serialize(), function(data){
            _this.procesarAgregar(data);
            $("#modal_nuevo").modal("hide");
            common.agregarMensaje("El trabajador ha sido ingresado exitosamente");
        });
    },

    procesarAgregar: function(data){
        var html,
            tpl = $("#tpl_nuevo_trabajador").html(),
            render = Handlebars.compile(tpl);

        html = render({
            id : data.id,
            nombre : data.nombre,
            apellido : data.apellido,
            rut : data.rut,
            estado_vacaciones : data.estado_vacaciones
        });

        $("#lista_trabajadores tbody").append(html);
    },

    guardarUpdate: function(){
        var nombre = $("#nombre_edit"),
            apellido = $("#apellido_edit"),
            rut = $("#rut_edit"),
            domicilio = $("#domicilio_edit"),
            fechaNacimiento = $("#fecha_nacimiento_edit"),
            inicioContrato = $("#inicio_contrato_edit"),
            vigenciaLicencia = $("#vigencia_licencia_edit"),
            afp = $("#afp_edit"),
            sistemaSalud = $("#sistema_salud_edit"),
            estadoCivil = $("#estado_civil_edit"),
            estadoVacacion = $("#estado_vacacion_edit"),
            valido = true;

        valido = this.validarCampos(nombre, apellido, rut, domicilio, fechaNacimiento,
            inicioContrato, vigenciaLicencia, afp, sistemaSalud, estadoCivil, estadoVacacion);
    },

    validarCampos: function(nombre, apellido, rut, domicilio, fechaNacimiento,
        inicioContrato, vigenciaLicencia, afp, sistemaSalud, estadoCivil, estadoVacacion){

        var valido = true;

        if(nombre.val().trim() === ""){
            valido = false;
            nombre.siblings("span").text("campo obligatorio");
            nombre.parent().addClass("has-error");
        }

        if(apellido.val().trim() === ""){
            valido = false;
            apellido.siblings("span").text("campo obligatorio");
            apellido.parent().addClass("has-error");
        }

        if(rut.val().trim() === ""){
            valido = false;
            rut.siblings("span").text("campo obligatorio");
            rut.parent().addClass("has-error");
        }else if(!$.Rut.validar(rut.val())){
            valido = false;
            rut.siblings("span").text("El rut no es válido");
            rut.parent().addClass("has-error");
        }

        if(domicilio.val().trim() === ""){
            valido = false;
            domicilio.siblings("span").text("campo obligatorio");
            domicilio.parent().addClass("has-error");
        }

        if(fechaNacimiento.val().trim() === ""){
            valido = false;
            fechaNacimiento.siblings("span").text("campo obligatorio");
            fechaNacimiento.parent().addClass("has-error");
        }

        if(inicioContrato.val().trim() === ""){
            valido = false;
            inicioContrato.siblings("span").text("campo obligatorio");
            inicioContrato.parent().addClass("has-error");
        }

        if(vigenciaLicencia.val().trim() === ""){
            valido = false;
            vigenciaLicencia.siblings("span").text("campo obligatorio");
            vigenciaLicencia.parent().addClass("has-error");
        }

        if(afp.val().trim() === ""){
            valido = false;
            afp.siblings("span").text("campo obligatorio");
            afp.parent().addClass("has-error");
        }

        if(sistemaSalud.val().trim() === ""){
            valido = false;
            sistemaSalud.siblings("span").text("campo obligatorio");
            sistemaSalud.parent().addClass("has-error");
        }

        if(estadoCivil.val().trim() === ""){
            valido = false;
            estadoCivil.siblings("span").text("campo obligatorio");
            estadoCivil.parent().addClass("has-error");
        }

        if(estadoVacacion.val().trim() === ""){
            valido = false;
            estadoVacacion.siblings("span").text("campo obligatorio");
            estadoVacacion.parent().addClass("has-error");
        }

        return valido;
    }
};
