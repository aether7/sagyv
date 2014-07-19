App.Controllers.SituacionComercial = function(){
    this.btnAgregarSituacion = $("#btn_agregar_situacion");
    this.btnGuardarSituacion = $("#btn_guardar_situacion");
    this.btnUpdateSituacion = $("#btn_update_situacion");
    this.idSituacion = null;
    this.situacionUrl = null;
};

App.Controllers.SituacionComercial.prototype = {
    constructor: App.Controllers.SituacionComercial,

    init: function(){
        var _this = this;

        this.btnAgregarSituacion.on("click",function(){
            common.mostrarModal("agregar_situacion");
        });

        this.btnGuardarSituacion.on("click", function(){
            _this.guardarSituacion();
        });

        this.btnUpdateSituacion.on("click",function(){
            _this.guardarUpdateSituacion();
        });

        $("#tabla_s_comerciales").on("click","a[data-accion=editar]",function(evt){
            evt.preventDefault();
            common.mostrarModal("editar_situacion");
            _this.cargarSituacion($(this).data("id"));
        });

        $("#sit_comercial_add").on("change",function(){
            if($(this).val() === "otro"){
                $("#nueva_situacion_add").removeClass("hidden");
            }else{
                $("#nueva_situacion_add").addClass("hidden");
            }
        });
    },

    guardarSituacion: function(){
        var json,
            valido,
            tipo = $("#sit_tipo_add"),
            valor = $("#descuento_add"),
            _this = this;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        valido = this.validarSituacion(valor, tipo);

        if(!valido){
            return
        }

        json = {
            tipo : tipo.val(),
            valor : valor.val()
        };

        $.post($("#f_agregar_situacion").attr("action"), json, function(data){
            var str = "<option value='{0}'>{1}</option>";

            $("#modal_agregar_situacion").modal("hide");
            common.agregarMensaje("La situacion comercial fue ingresado exitosamente");
            _this.procesarAgregarSituacion(data);

            if(data.tipo_int == 1){
                textSupport = "$ "+data.valor;
            }else{
                textSupport = "% "+data.valor;
            }
            str = str.format(data.id_situacion, textSupport);
            $(str).insertBefore("#sit_comercial_add option:last");

        });
    },

    validarSituacion: function(valor, tipo){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(valor.val().trim() === ""){
            valido = false;
            valor.siblings("span").text("Campo obligatorio");
            valor.parent().addClass("has-error");
        }else if(!type.isNumber(parseInt(valor.val()))){
            valido = false;
            valor.siblings("span").text("Debe ser un número");
            valor.parent().addClass("has-error");
        }else if(parseInt(valor.val()) < 1){
            valido = false;
            valor.siblings("span").text("Debe ingresar un monto mayor a 1");
            valor.parent().addClass("has-error");
        }

        if(tipo.val().trim() == ""){
            valido = false;
            tipo.siblings("span").text("Campo obligatorio");
            tipo.parent().addClass("has-error");
        }

        return valido;
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
        var url = this.situacionUrl.replace("0", id);
        this.idSituacion = id;

        $.get(url, function(data){
            $("#descuento_edit").val(data.monto_descuento);
            $("#sit_tipo_edit").val(data.tipo_descuento);
        });
    },

    guardarUpdateSituacion:function(){
        var json,
            valido,
            tipo = $("#sit_tipo_edit"),
            valor = $("#descuento_edit"),
            _this = this;

        valido = this.validarSituacion(valor, tipo);

        if(!valido){
            return
        }

        json = {
            tipo : tipo.val(),
            valor : valor.val(),
            id_situacion : this.idSituacion
        };

        $.post($("#f_modificar_situacion").attr("action"), json, function(data){
            $("#modal_editar_situacion").modal("hide");
            common.agregarMensaje("El cliente fue actualizado exitosamente");

            var tr = $("a[data-id={0}][data-accion=editar]".format(_this.idSituacion)).closest("tr");

            tr.find("[data-columna=tipo_descuento]").text(json.tipo);
            tr.find("[data-columna=descuento]").text(json.valor);
        });
    }
};
