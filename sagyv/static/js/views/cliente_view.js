App.Views.Cliente = function(){
    this.controller = new App.Controllers.Cliente();
    this.listaClientes = $("#tabla_clientes tbody");

    this.idCliente = null;
    this.nombre = null;
    this.giro = null;
    this.direccion = null;
    this.telefono = null;
    this.rut = null;
    this.situacionComercial = null;
    this.credito = null;
    this.dispensador = null;
    this.esLipigas = null;
    this.observacion = null;
    this.cantidad = null;
    this.tipo = null;
    this.producto = null;
};

App.Views.Cliente.prototype = {
    constructor: App.Views.Cliente,

    init: function(){
        $("#tabla_clientes").tablesorter();
        $("#btn_agregar").on("click",this.mostrarModal);

        $("#btn_guardar_add").on("click", this.guardarAdd.bind(this));
        $("#btn_guardar_update").on("click", this.guardarUpdate.bind(this));

        $("#sit_comercial_add").on("change", this.sitComercialHandler("add"));
        $("#sit_comercial_update").on("change", this.sitComercialHandler("update"));

        $("#f_buscar_cliente").on("submit", this.buscarCliente());

        this.listaClientes.on("click","a[data-accion=editar]", this.editarCliente());
        this.listaClientes.on("click","a[data-accion=eliminar]",this.eliminarCliente());
        this.listaClientes.on("click","a[data-accion=ver]", this.verCliente());

        this.agregarSuscriptores();
    },

    agregarSuscriptores: function(){
        pubsub.suscribe("cliente:noValido", this.esValido, this);
        pubsub.suscribe("cliente:procesarCrear", this.procesarCrear, this);
        pubsub.suscribe("cliente:removerCliente", this.removerCliente);
        pubsub.suscribe("cliente:cargarCliente", this.cargarCliente);
        pubsub.suscribe("cliente:buscar", this.procesarBuscar);
        pubsub.suscribe("cliente:actualizarCliente", this.actualizarCliente);
        pubsub.suscribe("cliente:verCliente", this.procesarVerCliente);
    },

    procesarVerCliente: function(data){
        var lipigas = data.es_lipigas ? "Sí" : "No",
            dispensador = data.dispensador ? "Sí" : "No",
            credito = data.credito ? "Sí" : "No",
            propio = data.es_propio ? "Sí" : "No",
            situacionComercial;

        if(data.situacion_comercial.tipo_descuento === 1){
            situacionComercial = "${0} en {1} {2}".format(
                data.situacion_comercial.monto_descuento,
                data.producto.nombre,
                data.producto.tipo
            );
        }else if(data.situacion_comercial.tipo_descuento === 2){
            situacionComercial = "{0}% en {1} {2}".format(
                data.situacion_comercial.monto_descuento,
                data.producto.nombre,
                data.producto.tipo
            );
        }else{
            situacionComercial = "Sin descuento";
        }

        $("#nombre_ver").text(data.nombre);
        $("#giro_ver").text(data.giro);
        $("#direccion_ver").text(data.direccion);
        $("#telefono_ver").text(data.telefono);
        $("#rut_ver").text(data.rut);
        $("#sit_comercial_ver").text(situacionComercial);
        $("#credito_ver").text(credito);
        $("#es_lipigas_ver").text(lipigas);
        $("#dispensador_ver").text(dispensador);
        $("#es_propio_ver").text(propio);
        $("#obs_ver").text(data.obs);

        $("#modal_ver").modal("show");
    },

    verCliente: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();
            var id = $(this).data("id");
            _this.controller.verCliente(id);
        };
    },

    procesarBuscar: function(data){
        var template = $("#tpl_nuevo_cliente").html(),
            fn = Handlebars.compile(template),
            _this = this;

        this.listaClientes = $("#tabla_clientes tbody");
        this.listaClientes.empty();

        data.forEach(function(cliente){
            _this.listaClientes.append(fn({
                id : cliente.id,
                nombre : cliente.nombre,
                rut : cliente.rut,
                direccion : cliente.direccion,
                giro : cliente.giro,
                situacion_comercial : cliente.situacion_comercial,
                telefono : cliente.telefono
            }));
        });
    },

    actualizarCliente: function(data){
        var tr = $("a[data-id={0}][data-accion=editar]".format(data.id)).closest("tr");

        tr.find("[data-columna=nombre]").text(data.nombre);
        tr.find("[data-columna=giro]").text(data.giro);
        tr.find("[data-columna=telefono]").text(data.telefono);
        tr.find("[data-columna=direccion]").text(data.direccion);
        tr.find("[data-columna=situacion_comercial]").text(data.situacion_comercial);

        $("#modal_editar").modal("hide");
        common.agregarMensaje("El cliente fue actualizado exitosamente");
    },

    procesarCrear: function(data){
        $("#modal_agregar").modal("hide");
        this.procesarAgregar(data);
        common.agregarMensaje("El cliente fue ingresado exitosamente");

        if( $("#numero_add").val() != '' ){
            var str = "<option value='{0}'>{1}</option>";

            str = str.format(data.situacion_comercial.id, data.situacion_comercial.texto);
            $(str).insertBefore("#sit_comercial_add option:last");
            $(str).insertBefore("#sit_comercial_update option:last");
        }
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
            nombre : data.nombre,
            giro : data.giro,
            rut : data.rut,
            situacion_comercial : data.situacion_comercial.texto,
            telefono : data.telefono,
            direccion : data.direccion,
            id : data.id
        });

        $("#tabla_clientes tbody").append(html);
    },

    esValido: function(errorList){
        common.mostrarErroresVista(this.getFields(), errorList);
    },

    mostrarModal: function(){
        $("#nueva_situacion_add").addClass("hidden");
        common.mostrarModal("agregar");
    },

    sitComercialHandler: function(mode){
        return function(){
            if($(this).val() === "otro"){
                $("#nueva_situacion_" + mode).removeClass("hidden");
            }else{
                $("#nueva_situacion_" + mode).addClass("hidden");
            }
        };
    },

    guardarAdd: function(){
        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.nombre = $("#nombre_add");
        this.giro = $("#giro_add");
        this.direccion = $("#direccion_add");
        this.telefono = $("#telefono_add");
        this.rut = $("#rut_add");
        this.situacionComercial = $("#sit_comercial_add");
        this.credito = $("#credito_add");
        this.dispensador = $("#dispensador_add");
        this.esLipigas = $("#es_lipigas_add");
        this.esPropio = $("#es_propio_add");
        this.observacion = $("#obs_add");
        this.cantidad = $("#numero_add");
        this.tipo = $("#tipo_add");
        this.producto = $("#sel_producto_add");
        this.esPropio = $("#es_propio_add");

        this.controller.guardarAdd({
            nombre : this.nombre.val(),
            giro : this.giro.val(),
            direccion : this.direccion.val(),
            telefono : this.telefono.val(),
            rut : this.rut.val(),
            situacionComercial : this.situacionComercial.val(),
            credito : this.credito.is(":checked"),
            es_lipigas : this.esLipigas.is(":checked"),
            es_propio: this.esPropio.is(':checked'),
            dispensador : this.dispensador.is(":checked"),
            observacion : this.observacion.val(),
            cantidad : this.cantidad.val(),
            tipo : this.tipo.val(),
            producto : this.producto.val()
        });
    },

    guardarUpdate: function(){
        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        this.nombre = $("#nombre_update");
        this.giro = $("#giro_update");
        this.direccion = $("#direccion_update");
        this.telefono = $("#telefono_update");
        this.rut = $("#rut_update");
        this.situacionComercial = $("#sit_comercial_update");
        this.credito = $("#credito_update");
        this.esLipigas = $("#es_lipigas_update");
        this.esPropio = $("#es_propio_update");
        this.dispensador = $("#dispensador_update");
        this.observacion = $("#obs_update");
        this.cantidad = $("#numero_update");
        this.tipo = $("#tipo_update");
        this.producto = $("#sel_producto_update");

        this.controller.guardarUpdate({
            nombre : this.nombre.val(),
            giro : this.giro.val(),
            direccion : this.direccion.val(),
            telefono : this.telefono.val(),
            rut : this.rut.val(),
            situacionComercial : this.situacionComercial.val(),
            credito : this.credito.is(":checked"),
            dispensador : this.dispensador.is(":checked"),
            es_lipigas : this.esLipigas.is(":checked"),
            es_propio: this.esPropio.is(':checked'),
            observacion : this.observacion.val(),
            cantidad : this.cantidad.val(),
            tipo : this.tipo.val(),
            producto : this.producto.val()
        });

    },

    buscarCliente: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();

            var busqueda = $("#cliente_busqueda").val(),
                opcion = $("#cliente_opcion").val(),
                action = $(this).attr("action");

            _this.controller.buscarCliente(busqueda, opcion, action);
        };
    },

    editarCliente: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();

            _this.idCliente = $(this).data("id");
            $("#nueva_situacion_update").addClass("hidden");
            common.mostrarModal("editar");
            _this.controller.cargarCliente($(this).data("id"));
        };
    },

    cargarCliente: function(data){
        $("#giro_update").val(data.giro);
        $("#nombre_update").val(data.nombre);
        $("#direccion_update").val(data.direccion);
        $("#telefono_update").val(data.telefono);
        $("#rut_update").val(data.rut);
        $("#sit_comercial_update").val(data.situacion_comercial);
        $("#obs_update").val(data.obs);

        if(data.credito){
            $("#credito_update").get(0).checked = true;
        }

        if(data.dispensador){
            $("#dispensador_update").get(0).checked = true;
        }

        if(data.es_lipigas){
            $("#es_lipigas_update").get(0).checked = true;
        }

        if(data.es_propio){
            $("#es_propio_update").get(0).checked = true;
        }

    },

    eliminarCliente: function(){
        var _this = this;

        return function(evt){
            if(!confirm("Esta acción eliminará al cliente, ¿ desea continuar ?")){
                return;
            }

            evt.preventDefault();
            _this.controller.eliminarCliente($(this).data("id"));
        };
    },

    removerCliente: function(data){
        $("a[data-id={0}][data-accion=editar]".format(data.id)).closest("tr").remove();
        common.agregarMensaje("Se ha eliminado al cliente exitosamente");
    },

    addClienteRut: function(rut){
        this.controller.addClienteRut(rut);
    },

    getFields: function(){
        return {
            nombre : this.nombre,
            giro : this.giro,
            direccion : this.direccion,
            telefono : this.telefono,
            rut : this.rut,
            situacionComercial : this.situacionComercial,
            credito : this.credito,
            dispensador : this.dispensador,
            es_lipigas : this.esLipigas,
            observacion : this.observacion,
            cantidad : this.cantidad,
            tipo : this.tipo,
            producto : this.producto,
            es_propio: this.esPropio
        };
    }
};