App.Views.SituacionComercial = function(){
    this.controller = new App.Controllers.SituacionComercial();
    this.idSituacion = null;
    this.monto = null;
    this.tipo = null;
    this.producto = null;
};

App.Views.SituacionComercial.prototype = {
    constructor: App.Views.SituacionComercial,

    init: function(){
        var tablaComerciales = $("#tabla_s_comerciales");

        tablaComerciales.tablesorter();
        tablaComerciales.on("click", "a[data-accion=editar]", this.editarSituacion());

        $("#btn_agregar_situacion").on("click", this.agregarSituacion);
        $("#btn_guardar_situacion").on("click", this.guardarSituacion.bind(this));
        $("#btn_update_situacion").on("click", this.guardarUpdateSituacion());

        this.addSuscribers();
    },

    addSuscribers: function(){
        pubsub.suscribe("sitComercial:noValido", this.mostrarErrores, this);
        pubsub.suscribe("sitComercial:procesarCrear", this.procesarCrear);
        pubsub.suscribe("sitComercial:cargarDatosEdicion", this.cargarDatosEdicion);
        pubsub.suscribe("sitComercial:procesarActualizar", this.procesarActualizar);
    },

    editarSituacion: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();

            _this.idSituacion = $(this).data("id");
            _this.controller.cargarSituacion(_this.idSituacion);
        };
    },

    cargarDatosEdicion: function(data){
        common.mostrarModal("editar_situacion");

        $("#descuento_edit").val(data.monto_descuento);
        $("#sit_tipo_edit").val(data.tipo_descuento);
        $("#producto_edit").val(data.formato_descuento);
    },

    agregarSituacion: function(){
        common.mostrarModal("agregar_situacion");
    },

    guardarSituacion: function(){
        this.monto = $("#descuento_add");
        this.tipo = $("#sit_tipo_add");
        this.producto = $("#sit_producto_add");

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.controller.guardarSituacion(this.monto.val(),
            this.tipo.val(),
            this.producto.val());
    },

    guardarUpdateSituacion: function(){
        var _this = this;

        return function(){
            _this.monto = $("#descuento_edit");
            _this.tipo = $("#sit_tipo_edit");
            _this.producto = $("#producto_edit");

            _this.controller.guardarUpdateSituacion(_this.monto.val(), _this.tipo.val(),
                _this.producto.val(), _this.idSituacion);
        };
    },

    editarSituacionComercial: function(evt){
        evt.preventDefault();

        this.idSituacion = $(this).data("id");
        this.controller.cargarSituacion(this.idSituacion);
    },

    addSituacionComercial: function(tipoDescuento, monto, producto){
        this.controller.addSituacionComercial(tipoDescuento, monto, producto);
    },

    getFields: function(){
        return {
            monto : this.monto,
            tipo : this.tipo,
            producto : this.producto
        };
    },

    mostrarErrores: function(errorList){
        common.mostrarErroresVista(this.getFields(), errorList);
    },

    procesarCrear: function(data){
        var html,
            opt = "<option value='{0}' data-id='{0}'>{1}</option>",
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
        $(opt).insertBefore("#sit_comercial_update option:last");

        $("#tabla_s_comerciales tbody").append(html);
        $("#modal_agregar_situacion").modal("hide");
        common.agregarMensaje("La situacion comercial fue ingresado exitosamente");
    },

    procesarActualizar: function(data){
        $("#modal_editar_situacion").modal("hide");
        common.agregarMensaje("La situación comercial fue actualizada exitosamente");

        var tr = $("#tabla_s_comerciales tr[data-id={0}]".format(data.id_situacion));
        textTmp = "( {0} ) {1}";
        textTmp = textTmp.format(data.producto.codigo, data.valor_descripcion);

        tr.find("[data-columna=tipo_descuento]").text(data.tipo);
        tr.find("[data-columna=descuento]").text(data.valor);
        tr.find("[data-columna=producto]").text(textTmp)

        $("#sit_comercial_add option[data-id={0}]".format(data.id_situacion)).text(data.valor_descripcion);
        $("#sit_comercial_update option[data-id={0}]".format(data.id_situacion)).text(data.valor_descripcion);
    }
};
