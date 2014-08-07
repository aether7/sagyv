App.Views.Cliente = function(){
    this.controller = new App.Controllers.Cliente();
    this.listaClientes = $("#tabla_clientes tbody");

    this.nombre = null;
    this.giro = null;
    this.direccion = null;
    this.telefono = null;
    this.rut = null;
    this.situacionComercial = null;
    this.credito = null;
    this.dispensador = null;
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
        $("#btn_guardar_update").on("click", this.guardarUpdate);

        $("#sit_comercial_add").on("change", this.sitComercialHandler("add"));
        $("#sit_comercial_update").on("change", this.sitComercialHandler("update"));

        $("#f_buscar_cliente").on("submit", this.buscarCliente);

        this.listaClientes.on("click","a[data-accion=editar]", this.editarCliente);
        this.listaClientes.on("click","a[data-accion=eliminar]",this.eliminarCliente());

        this.agregarSuscriptores();
    },

    agregarSuscriptores: function(){
        pubsub.suscribe("cliente:noValido", this.esValido, this);
        pubsub.suscribe("cliente:removerCliente", this.removerCliente);
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
        this.nombre = $("#nombre_add");
        this.giro = $("#giro_add");
        this.direccion = $("#direccion_add");
        this.telefono = $("#telefono_add");
        this.rut = $("#rut_add");
        this.situacionComercial = $("#sit_comercial_add");
        this.credito = $("#credito_add");
        this.dispensador = $("#dispensador_add");
        this.observacion = $("#obs_add");
        this.cantidad = $("#numero_add");
        this.tipo = $("#tipo_add");
        this.producto = $("#sel_producto_add");

        this.controller.guardarAdd({
            nombre : this.nombre.val(),
            giro : this.giro.val(),
            direccion : this.direccion.val(),
            telefono : this.telefono.val(),
            rut : this.rut.val(),
            situacionComercial : this.situacionComercial.val(),
            credito : this.credito.val(),
            dispensador : this.dispensador.val(),
            observacion : this.observacion.val(),
            cantidad : this.cantidad.val(),
            tipo : this.tipo.val(),
            producto : this.producto.val()
        });
    },

    guardarUpdate: function(){
        this.controller.guardarUpdate();
    },

    buscarCliente: function(evt){
        evt.preventDefault();

        var busqueda = $("#cliente_busqueda").val(),
            action = $(this).attr("action");

        this.controller.buscarCliente(busqueda, action);
    },

    editarCliente: function(evt){
        evt.preventDefault();

        $("#nueva_situacion_update").addClass("hidden");
        common.mostrarModal("editar");

        this.controller.cargarCliente($(this).data("id"));
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
            observacion : this.observacion,
            cantidad : this.cantidad,
            tipo : this.tipo,
            producto : this.producto
        };
    }
};
