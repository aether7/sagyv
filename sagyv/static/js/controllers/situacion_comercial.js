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
    },

    guardarSituacion: function(){
        var json,
            valido,
            tipo = $("#sit_tipo_add"),
            valor = $("#descuento_add"),
            producto = $("#sit_producto_add"),
            _this = this;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        valido = this.validarSituacion(valor, tipo, producto);

        if(!valido){
            return
        }

        json = {
            tipo : tipo.val(),
            valor : valor.val().replace(/[\.,]/g, ""),
            producto : producto.val()
        };

        $.post($("#f_agregar_situacion").attr("action"), json, function(data){
            _this.procesarAgregarSituacion(data);
        });
    },

    validarSituacion: function(valor, tipo, producto){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(valor.val().trim() === ""){
            valido = false;
            valor.siblings("span").text("Campo obligatorio");
            valor.parent().addClass("has-error");
        }else if(!/^\d+$/.test(valor.val()) || !type.isNumber(parseInt(valor.val()))){
            valido = false;
            valor.siblings("span").text("Solo se deben agregar números");
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

        if(producto.val().trim() === ""){
            valido = false;
            producto.siblings("span").text("Campo obligatorio");
            producto.parent().addClass("has-error");
        }

        return valido;
    },

    procesarAgregarSituacion: function(data){
        var html,
            opt = "<option value='{0}' data-id='{0}'>{1}</option>",
            situacionComercial,
            template = $("#tpl_nueva_situacion").html(),
            render = Handlebars.compile(template);

        html = render({
            tipo_descuento : data.tipo_descuento.tipo,
            descuento : data.valor,
            id : data.id_situacion,
            producto : {
                nombre : data.producto.nombre + " " + data.producto.nombre_tipo_producto,
                codigo : data.producto.codigo
            }
        });

        opt = opt.format(data.id_situacion, data.valor_descripcion);
        $(opt).insertBefore("#sit_comercial_add option:last");

        $("#tabla_s_comerciales tbody").append(html);
        $("#modal_agregar_situacion").modal("hide");
        common.agregarMensaje("La situacion comercial fue ingresado exitosamente");
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
            producto = $("#producto_edit"),
            _this = this;

        valido = this.validarSituacion(valor, tipo, producto);

        if(!valido){
            return
        }

        json = {
            tipo : tipo.val(),
            valor : valor.val().replace(/[\.,]/g, ""),
            id_situacion : this.idSituacion
        };

        $.post($("#f_modificar_situacion").attr("action"), json, function(data){
            $("#modal_editar_situacion").modal("hide");
            common.agregarMensaje("La situación comercial fue actualizada exitosamente");

            var tr = $("a[data-id={0}][data-accion=editar]".format(_this.idSituacion)).closest("tr");

            tr.find("[data-columna=tipo_descuento]").text(data.tipo);
            tr.find("[data-columna=descuento]").text(json.valor);

            $("#sit_comercial_add option[data-id={0}]".format(_this.idSituacion)).text(data.valor_descripcion);
            $("#sit_comercial_update option[data-id={0}]".format(_this.idSituacion)).text(data.valor_descripcion);
        });
    }
};
