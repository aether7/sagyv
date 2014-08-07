App.Views.Cliente = function(){
    this.controller = new App.Controllers.Cliente();
    this.listaClientes = $("#tabla_clientes tbody");
};

App.Views.Cliente.prototype = {
    constructor: App.Views.Cliente,

    init: function(){
        $("#tabla_clientes").tablesorter();
        $("#btn_agregar").on("click",this.mostrarModal);

        $("#btn_guardar_add").on("click", this.guardarAdd);
        $("#btn_guardar_update").on("click", this.guardarUpdate);

        $("#sit_comercial_add").on("change", this.sitComercialHandler("add"));
        $("#sit_comercial_update").on("change", this.sitComercialHandler("update"));

        $("#f_buscar_cliente").on("submit", this.buscarCliente);

        this.listaClientes.on("click","a[data-accion=editar]", this.editarCliente);
        this.listaClientes.on("click","a[data-accion=eliminar]", this.eliminarCliente);
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
        this.controller.guardarAdd();
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

    eliminarCliente: function(evt){
        evt.preventDefault();

        this.controller.eliminarCliente($(this).data("id"));
    },

    addClienteRut: function(rut){
        this.controller.addClienteRut(rut);
    }
};
