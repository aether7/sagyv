App.Controllers.Cliente = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardarAdd = $("#btn_guardar_add");
    this.btnGuardarUpdate = $("#btn_guardar_update");
    this.mensaje = $("#mensaje");
    this.clienteUrl = null;
    this.eliminarUrl = null;
    this.idCliente = null;

    this.btnAgregarSituacion = $("#btn_agregar_situacion");
    this.btnGuardarSituacion = $("#btn_guardar_situacion");
    this.idSituacion = null;
    this.situacionUrl = null;
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    init: function(){
        var _this = this;

        this.btnAgregar.on("click",function(){
            _this.mostrarModal("agregar");
        });

        this.btnAgregarSituacion.on("click",function(){
            _this.mostrarModal("agregar_situacion");
        });

        this.btnGuardarAdd.on("click", function(){
            _this.guardarAdd();
        });

        this.btnGuardarSituacion.on("click", function(){
            _this.guardarSituacion();
        })

        this.btnGuardarUpdate.on("click", function(){
            _this.guardarUpdate();
        });

        $("#tabla_clientes").on("click","a[data-accion=editar]",function(evt){
            evt.preventDefault();
            _this.mostrarModal("editar");
            _this.cargarCliente($(this).data("id"));
        });

        $("#tabla_s_comerciales").on("click","a[data-accion=editar]",function(evt){
            evt.preventDefault();
            _this.mostrarModal("editar_situacion");
            alert($(this).data("id"));
            _this.cargarSituacion($(this).data("id"));
        });

        $("#tabla_clientes").on("click","a[data-accion=eliminar]",function(evt){
            evt.preventDefault();
            _this.eliminarCliente($(this).data("id"));
        });

        $("#sit_comercial_add").on("change",function(){
            if($(this).val() === "otro"){
                $("#nueva_situacion_add").removeClass("hidden");
            }else{
                $("#nueva_situacion_add").addClass("hidden");
            }
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
            $("#giro_update").val(data.giro);
            $("#direccion_update").val(data.direccion);
            $("#telefono_update").val(data.telefono);
            $("#rut_update").val(data.rut);
            $("#sit_comercial_update").val(data.situacion_comercial);

            if(data.credito){
                $("#credito_update").get(0).checked = true;
            }
        });
    },

    eliminarCliente: function(id){
        this.id = id;

        if(!confirm("Esta acción eliminará al cliente, ¿ desea continuar ?")){
            return;
        }

        $.post(this.eliminarUrl, { id_cliente : id }, function(data){
            $("a[data-id={0}][data-accion=editar]".format(id)).closest("tr").remove();
        });
    },

    guardarAdd: function(){
        var json,
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
            giro : giro.val(),
            direccion : direccion.val(),
            telefono : telefono.val(),
            rut : rut.val(),
            situacion_comercial : sitComercial.val(),
            credito : credito.is(":checked"),
            cantidad : $("#numero_add").val(),
            tipo : $("#tipo_add").val()
        };

        $.post($("#f_agregar_cliente").attr("action"), json, function(data){
            json.id = data.id;

            $("#modal_agregar").modal("hide");
            _this.procesarAgregar(json);
            _this.agregarMensaje("El cliente fue ingresado exitosamente");

            var str = "<option value='{0}'>{1}</option>";
            str = str.format(data.situacion_comercial.id, data.situacion_comercial.tipo);
            $(str).insertBefore("#sit_comercial_add option:last");
        });
    },

    procesarAgregar: function(data){
        var html,
            situacionComercial,
            template = $("#tpl_nuevo_cliente").html(),
            render = Handlebars.compile(template);

        if(data.situacion_comercial == 1){
            situacionComercial = "Sin descuento";
        }else{
            situacionComercial = data.situacion_comercial;
        }

        html = render({
            giro : data.giro,
            rut : data.rut,
            situacion_comercial : situacionComercial,
            telefono : data.telefono,
            id : data.id
        });

        $("#tabla_clientes tbody").append(html);
    },

    guardarUpdate: function(){
        var json,
            nombre = $("#nombre_update"),
            giro = $("#giro_update"),
            direccion = $("#direccion_update"),
            telefono = $("#telefono_update"),
            rut = $("#rut_update"),
            sitComercial = $("#sit_comercial_update"),
            credito = $("#credito_update"),
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
            credito : credito.is(":checked"),
            id_cliente : this.idCliente
        };

        $.post($("#f_editar_cliente").attr("action"), json, function(data){
            $("#modal_editar").modal("hide");
            _this.agregarMensaje("El cliente fue actualizado exitosamente");

            var tr = $("a[data-id={0}][data-accion=editar]".format(_this.idCliente)).closest("tr");

            tr.find("[data-columna=giro]").text(json.giro);
            tr.find("[data-columna=telefono]").text(json.telefono);
            tr.find("[data-columna=situacion_comercial]").text(json.situacion_comercial);
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
    },

    setEliminarUrl: function(eliminarUrl){
        this.eliminarUrl = eliminarUrl;
    },

    //situacion comercial
    guardarSituacion: function(){
        var json,
        tipo = $("#sit_tipo_add"),
        valor = $("#descuento_add"),
        valido = true,
        _this = this;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(tipo.val().trim() == ""){
            valido = false;
            tipo.siblings("span").text("Campo obligatorio");
            tipo.parent().addClass("has-error");
        }

        if(isNaN(valor.val())){
            valido = false;
            valor.siblings("span").text("Ingrese un numero");
            valor.parent().addClass("has-error");
        }else if(valor.val().trim() === ""){
            valido = false;
            valor.siblings("span").text("Campo obligatorio");
            valor.parent().addClass("has-error");
        }

        if(!valido){
            return
        }

        json = {
            tipo : tipo.val(),
            valor : valor.val()
        };

        $.post($("#f_agregar_situacion").attr("action"), json, function(data){
            $("#modal_agregar_situacion").modal("hide");
            _this.agregarMensaje("La situacion comercial fue ingresado exitosamente");
            _this.procesarAgregarSituacion(data);

            var str = "<option value='{0}'>{1}</option>";
            if(data.tipo_int == 1){
                textSupport = "$ "+data.valor;
            }else{
                textSupport = "% "+data.valor;
            }
            str = str.format(data.id_situacion, textSupport);
            $(str).insertBefore("#sit_comercial_add option:last");
            
        });
    },

    procesarAgregarSituacion: function(data){
        var html,
            situacionComercial,
            template = $("#tpl_nueva_situacion").html(),
            render = Handlebars.compile(template);

        html = render({
            tipo_descuento : data.tipo,
            descuento : data.valor,
            id : data.id_situacion
        });

        $("#tabla_s_comerciales tbody").append(html);
    },

    cargarSituacion: function(id){
        this.idSituacion = id;
        alert(this.situacionUrl);
        $.get(this.situacionUrl.replace("0", id),function(data){
            $("#descuento_edit").val(data.monto_descuento);
            $("#sit_tipo_edit").val(data.tipo_descuento);
        });

    },

    setSituacionUrl: function(situacionUrl){
        this.situacionUrl = situacionUrl;
    }
};
