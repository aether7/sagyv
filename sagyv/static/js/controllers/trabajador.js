App.Controllers.Trabajador = function(){
    this.fNuevo = $("#f_nuevo");
    this.fEdit = $("#f_edit");
    this.btnNuevo = $("#btn_nuevo_trabajador");
    this.listaTrabajadores = $("#lista_trabajadores tbody");
    this.urlObtenerTrabajador = null;
    this.urlEliminarTrabajador = null;
    this.id = null;
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

        this.fEdit.on("submit", function(evt){
            evt.preventDefault();
            _this.guardarUpdate($(this).attr("action"), $(this));
        });

        this.listaTrabajadores.on("click", "a[data-accion]", function(evt){
            evt.preventDefault();

            var accion = $(this).data("accion");
            _this.id = $(this).data("id");

            common.mostrarModal(accion);
            _this[accion + "Trabajador"]($(this).data("id"));
        });
    },

    verTrabajador: function(id){
        $.get(this.urlObtenerTrabajador,{ id : id }, function(data){
            $("#nombre_ver").text(data.nombre);
            $("#apellido_ver").text(data.apellido);
            $("#rut_ver").text(data.rut);
            $("#domicilio_ver").text(data.domicilio);
            $("#fecha_nacimiento_ver").text(common.fecha.formatearFecha(data.nacimiento));
            $("#inicio_contrato_ver").text(common.fecha.formatearFecha(data.fecha_inicio_contrato));
            $("#vigencia_licencia_ver").text(common.fecha.formatearFecha(data.vigencia_licencia));
            $("#afp_ver").text(data.afp.nombre);
            $("#sistema_salud_ver").text(data.sistema_salud.nombre);
            $("#estado_civil_ver").text(data.estado_civil.nombre);
            $("#estado_vacacion_ver").text(data.estado_vacacion.nombre);
        });
    },

    eliminarTrabajador: function(id){
        if(!confirm("Al confirmar se eliminará el trabajador, ¿ Desea continuar ?")){
            return;
        }

        var _this = this;

        $.post(this.urlEliminarTrabajador, { id: id }, function(data){
            _this.listaTrabajadores.find("tr[data-id={0}]".format(id)).remove();
            common.agregarMensaje("El trabajador ha sido eliminado exitosamente");
        });
    },

    editarTrabajador: function(id){
        $.get(this.urlObtenerTrabajador,{ id : id }, function(data){
            $("#nombre_edit").val(data.nombre);
            $("#apellido_edit").val(data.apellido);
            $("#rut_edit").val(data.rut);
            $("#domicilio_edit").val(data.domicilio);
            $("#fecha_nacimiento_edit").val(common.fecha.agregarCeros(data.nacimiento));
            $("#inicio_contrato_edit").val(common.fecha.agregarCeros(data.fecha_inicio_contrato));
            $("#vigencia_licencia_edit").val(common.fecha.agregarCeros(data.vigencia_licencia));
            $("#afp_edit").val(data.afp.id);
            $("#sistema_salud_edit").val(data.sistema_salud.id);
            $("#estado_civil_edit").val(data.estado_civil.id);
            $("#estado_vacacion_edit").val(data.estado_vacacion.id);
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

        this.listaTrabajadores.append(html);
    },

    guardarUpdate: function(action, $form){
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
            valido = true, json;

        valido = this.validarCampos(nombre, apellido, rut, domicilio, fechaNacimiento,
            inicioContrato, vigenciaLicencia, afp, sistemaSalud, estadoCivil, estadoVacacion);

        json = $form.serialize();
        json += "&id=" + this.id;

        $.post(action, json, function(data){
            console.log(data);

            $("#modal_edit").modal("hide");
            common.agregarMensaje("Se editó el trabajador exitosamente");
        });
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
