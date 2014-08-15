App.Views.Vehiculo = function(){
    this.controller = new App.Controllers.Vehiculo();

    this.idVehiculo = null;
    this.numero = null;
    this.patente = null;
    this.fechaRev = null;
    this.kilometraje = null;
    this.estadoSec = null;
    this.estadoPago = null;
    this.chofer = null;
};

App.Views.Vehiculo.prototype = {
    constructor: App.Views.Vehiculo,

    init: function(){
        var _this = this;

        $("#btn_nuevo_vehiculo").on("click", function(){
            _this.mostrar("modal_nuevo_vehiculo", "f_nuevo_vehiculo");
        });

        $("#btn_guardar_nuevo_vehiculo").on("click", this.validarNuevoVehiculo.bind(this));
        $("#btn_editar_vehiculo").on("click", this.validarEdicionVehiculo.bind(this));
        $("#lista_vehiculos").on("click", "*[data-accion]", this.accionesVehiculo());

        $("#btn_anexar").on("click", function(evt){
            evt.preventDefault();
            _this.guardarAnexar();
        });

        this.agregarSuscriptores();
    },

    accionesVehiculo: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();

            var accion = $(this).data("accion");
            _this.idVehiculo = $(this).data("id");

            if(type.isFunction(_this[accion])){
                _this[accion]();
            }

            common.mostrarModal(accion);
        };
    },

    agregarSuscriptores: function(){
        pubsub.suscribe("vehiculo:noValido", this.procesarNoValido.bind(this));
        pubsub.suscribe("vehiculo:noValidoAnexar", this.procesarNoValidoAnexar.bind(this));
        pubsub.suscribe("vehiculo:procesarNuevo", this.procesarNuevo);
        pubsub.suscribe("vehiculo:procesarEditar", this.procesarEditar);
        pubsub.suscribe("vehiculo:procesarAnexar", this.procesarAnexar.bind(this));
    },

    anexar: function(){
        var action = App.urls.get("vehiculos:obtener").replace("0", this.idVehiculo);

        $.get(action, function(data){
            var fecha = common.fecha.agregarCeros(data.fecha_revision_tecnica);

            $("#anexar_numero").val(data.numero);
            $("#anexar_chofer").val(data.chofer);
            $("#anexar_fecha").val(fecha);
        });
    },

    editar: function(){
        var action = App.urls.get("vehiculos:obtener").replace("0", this.idVehiculo);

        $.get(action, function(data){
            $("#numero_vehiculo_editar").val(data.numero);
            $("#patente_vehiculo_editar").val(data.patente);
            $("#kilometraje_vehiculo_editar").val(data.km);
            $("#revision_tecnica_vehiculo_editar").val(common.fecha.agregarCeros(data.fecha_revision_tecnica));
            $("#estado_sec_vehiculo_editar").val(data.estado_sec?1:0);
            $("#estado_pago_vehiculo_editar").val(data.estado_pago?1:0);
            $("#chofer_vehiculo_editar").val(data.chofer);
        });
    },

    mostrar: function(id, reseteo){
        $("#" + id).modal("show");

        if(reseteo){
            $("#" + reseteo).get(0).reset();
        }
    },

    agregarVehiculo: function(vehiculoNumero, vehiculoPatente){
        this.controller.vehiculos.push({
            numero : vehiculoNumero,
            patente : vehiculoPatente
        });
    },

    validarNuevoVehiculo: function(){
        this.numero = $("#numero_vehiculo_nuevo");
        this.patente = $("#patente_vehiculo_nuevo");
        this.fechaRev = $("#revision_tecnica_vehiculo_nuevo");
        this.kilometraje = $("#kilometraje_vehiculo_nuevo");
        this.estadoSec = $("#estado_sec_vehiculo_nuevo");
        this.estadoPago = $("#estado_pago_vehiculo_nuevo");
        this.chofer = $("#chofer_vehiculo_nuevo");

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.controller.validarNuevoVehiculo({
            numero: this.numero.val(),
            patente: this.patente.val(),
            fechaRev: this.fechaRev.val(),
            kilometraje: this.kilometraje.val(),
            estadoSec: this.estadoSec.val(),
            estadoPago: this.estadoPago.val(),
            chofer: this.chofer.val()
        });
    },

    validarEdicionVehiculo: function(){
        this.numero = $("#numero_vehiculo_editar");
        this.patente = $("#patente_vehiculo_editar");
        this.fechaRev = $("#revision_tecnica_vehiculo_editar");
        this.kilometraje = $("#kilometraje_vehiculo_editar");
        this.estadoSec = $("#estado_sec_vehiculo_editar");
        this.estadoPago = $("#estado_pago_vehiculo_editar");
        this.chofer = $("#chofer_vehiculo_editar");

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.controller.validarEdicionVehiculo({
            numero: this.numero.val(),
            patente: this.patente.val(),
            fechaRev: this.fechaRev.val(),
            kilometraje: this.kilometraje.val(),
            estadoSec: this.estadoSec.val(),
            estadoPago: this.estadoPago.val(),
            chofer: this.chofer.val(),
            id: this.idVehiculo
        });
    },

    procesarNoValido: function(errorList){
        common.mostrarErroresVista(this.getFields(), errorList);
    },

    procesarNuevo: function(data){
        var html,
            tpl = $("#tmpl_nuevo_vehiculo").html(),
            fx = Handlebars.compile(tpl),
            fxFecha = common.fecha.convertirFechaTextual;

        data.vehiculo.fecha_revision_tecnica = fxFecha(data.vehiculo.fecha_revision_tecnica);
        html = fx({ vehiculo : data.vehiculo });

        $("#lista_vehiculos tbody").append(html);
        $("#modal_nuevo_vehiculo").modal("hide");
        common.agregarMensaje("El vehiculo ha sido agregado exitosamente");
    },

    procesarEditar: function(data){
        var aux,
            texto,
            tr = $("#vehiculo_" + data.vehiculo.id);

        aux = tr.find("td[data-numero]");
        aux.data("numero", data.vehiculo.numero).
            attr("data-numero", data.vehiculo.numero).
            text(data.vehiculo.numero);

        aux = tr.find("td[data-patente]");
        aux.data("patente", data.vehiculo.patente).
            attr("data-patente", data.vehiculo).
            text(data.vehiculo.patente);

        aux = tr.find("td[data-km]");
        aux.data("km", data.vehiculo.km).
            attr("data-km", data.vehiculo.km).
            text(data.vehiculo.km);

        texto = common.fecha.convertirFechaTextual(data.vehiculo.fecha_revision_tecnica);
        aux = tr.find("td[data-fecha-revision-tecnica]");
        aux.data("fechaRevisionTecnica", texto).
            attr("data-fecha-revision-tecnica", texto).
            text(texto);

        texto = data.vehiculo.estado_sec ? "Sí" : "No";
        aux = tr.find("td[data-estado-sec]");
        aux.data("estadoSec", texto).
            attr("data-estado-sec", texto).
            text(texto);

        texto = data.vehiculo.estado_pago ? "Sí" : "No";
        aux = tr.find("td[data-estado-pago]");
        aux.data("estadoPago", texto).
            attr("data-estado-pago", texto).
            text(texto);

        aux = tr.find("td[data-nombre-chofer]");
        aux.data("nombreChofer", data.vehiculo.get_nombre_ultimo_chofer).
            attr("data-nombre-chofer", data.vehiculo.get_nombre_ultimo_chofer).
            text(data.vehiculo.get_nombre_ultimo_chofer);

        $("#modal_editar").modal("hide");
        common.agregarMensaje("El vehiculo ha sido modificado exitosamente");
    },

    guardarAnexar: function(){
        var numero = $("#anexar_numero"),
            chofer = $("#anexar_chofer"),
            fecha = $("#anexar_fecha");

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.controller.guardarAnexar(numero.val(), chofer.val(), fecha.val(), this.idVehiculo);
    },

    procesarNoValidoAnexar: function(errorList){
        errorList.forEach(function(error){
            var el = $("#anexar_" + error.campo);

            el.siblings("span").text(error.mensaje);
            el.parent().addClass("has-error");
        });
    },

    procesarAnexar: function(data){
        var el = $("td[data-nombre-chofer='{0}']".format(data.nombre_chofer)),
            nwEl = $("#vehiculo_{0} td[data-nombre-chofer]".format(this.idVehiculo));

        el.data("nombreChofer", "No anexado").
            attr("data-nombre-chofer", "No anexado").
            text("No anexado");

        nwEl.data("nombreChofer", data.nombre_chofer).
            attr("data-nombre-chofer", data.nombre_chofer).
            text(data.nombre_chofer);

        $("#modal_anexar").modal("hide");
        common.agregarMensaje("El chofer ha sido anexado exitosamente");
    },

    getFields: function(){
        return {
            numero: this.numero,
            patente: this.patente,
            revision_tecnica: this.fechaRev,
            kilometraje: this.kilometraje
        };
    }
};
