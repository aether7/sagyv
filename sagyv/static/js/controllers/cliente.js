App.Controllers.Cliente = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardarAdd = $("#btn_guardar_add");
    this.btnGuardarUpdate = $("#btn_guardar_update");
    this.mensaje = $("#mensaje");
    this.clienteUrl = null;
    this.idCliente = null;
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    init: function(){
        var _this = this;

        this.btnAgregar.on("click",function(){
            _this.mostrarModal("agregar");
        });

        this.btnGuardarAdd.on("click", function(){
            _this.guardarAdd();
        });

        $("a[data-accion=editar]").on("click",function(){
            _this.mostrarModal("editar");
            _this.cargarCliente($(this).data("id"));
        });
    },

    mostrarModal: function(id){
        var $modal = $("#modal_" + id);
        $modal.modal("show");
        $modal.find("form").get(0).reset();
        $(".has-error").removeClass("has-error");
        $(".help-block").text("");
    },

    cargarCliente: function(id){
        this.idCliente = id;

        $.get(this.clienteUrl.replace("0", id),function(data){
            console.log(data);
        });
    },

    guardarAdd: function(){
        var json,
            nombre = $("#nombre_add"),
            giro = $("#giro_add"),
            direccion = $("#direccion_add"),
            telefono = $("#telefono_add"),
            rut = $("#rut_add"),
            sitComercial = $("#sit_comercial_add"),
            credito = $("#credito_add"),
            valido = true,
            _this = this;

        valido = this.validarCampos(giro, direccion, telefono, rut);

        if(!valido){
            return;
        }

        json = {
            nombre : nombre.val(),
            giro : giro.val(),
            direccion : direccion.val(),
            telefono : telefono.val(),
            rut : rut.val(),
            situacion_comercial : sitComercial.val(),
            credito : credito.is(":checked")
        };

        $.post($("#f_agregar_cliente").attr("action"), json, function(data){
            $("#modal_agregar").modal("hide");
            _this.agregarMensaje("El cliente fue ingresado exitosamente");
            console.log(data);
        });
    },

    guardarUpdate: function(){
        var json,
            nombre = $("#nombre_add"),
            giro = $("#giro_add"),
            direccion = $("#direccion_add"),
            telefono = $("#telefono_add"),
            rut = $("#rut_add"),
            sitComercial = $("#sit_comercial_add"),
            credito = $("#credito_add"),
            valido = true,
            _this = this;

        valido = this.validarCampos(giro, direccion, telefono, rut);

        if(!valido){
            return;
        }

        json = {
            nombre : nombre.val(),
            giro : giro.val(),
            direccion : direccion.val(),
            telefono : telefono.val(),
            rut : rut.val(),
            situacion_comercial : sitComercial.val(),
            credito : credito.is(":checked")
        };

        $.post($("#f_agregar_cliente").attr("action"), json, function(data){
            $("#modal_editar").modal("hide");
            _this.agregarMensaje("El cliente fue ingresado exitosamente");
            console.log(data);
        });
    },

    validarCampos: function(giro, direccion, telefono, rut){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(giro.val().trim() === ""){
            valido = false;
            giro.siblings("span").text("Campo obligatorio");
            giro.parent().addClass("has-error");
        }

        if(direccion.val().trim() === ""){
            valido = false;
            direccion.siblings("span").text("Campo obligatorio");
            direccion.parent().addClass("has-error");
        }

        if(telefono.val().trim() === ""){
            valido = false;
            telefono.siblings("span").text("Campo obligatorio");
            telefono.parent().addClass("has-error");
        }else if(!type.isNumber(parseInt(telefono.val()))){
            valido = false;
            telefono.siblings("span").text("Debe ingresar número de teléfono válido");
        }

        if(rut.val().trim() === ""){
            valido = false;
            rut.siblings("span").text("Campo obligatorio");
            rut.parent().addClass("has-error");
        }else if(!$.Rut.validar(rut.val())){
            valido = false;
            rut.siblings("span").text("El rut es incorrecto");
            rut.parent().addClass("has-error");
        }

        return valido;
    },

    agregarMensaje: function(mensaje){
        var _this = this;
        this.mensaje.addClass("alert-success").show().text(mensaje);

        setTimeout(function(){
            _this.mensaje.removeClass("alert-success").hide().text("");
        },2500);
    },

    setClienteUrl: function(clienteUrl){
        this.clienteUrl = clienteUrl;
    }
};
