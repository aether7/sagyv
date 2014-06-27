App.Controllers.Bodega = function(){
    this.AGREGAR = 1;
    this.VENDER = 2;
    this.modo = null;
    this.mensaje = $("#mensaje");
    this.numFact = $("#factura_add");
    this.agregarStock = $("#cantidad_add");
    this.tituloModal = $("#titulo_modal");
    this.precio = $("#precio_update");
    this.cantidadActual = null;
    this.id = null;
};

App.Controllers.Bodega.prototype = {
    constructor: App.Controllers.Bodega,

    init: function(){

    },

    showModal: function(ventana, id, modo){
        var modalAbrir = "";

        this.id = id;

        if(ventana === "stock"){
            this.modalStock(modo);
            modalAbrir = "modal_add";
        }else if(ventana === "precio"){
            this.modalPrecio();
            modalAbrir = "modal_precio";
        }

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        $("#" + modalAbrir).modal("toggle");
    },

    modalStock: function(modo){
        var textoModal = null;
        this.modo = modo;

        if(this.modo === this.AGREGAR){
            textoModal = "Compra de producto";
        }else if(this.modo === this.VENDER){
            textoModal = "Venta de producto";
        }

        this.tituloModal.text(textoModal);
        this.cantidadActual = parseInt($("#stock_" + this.id).text());

        $("#modal_add_id").val(this.id);
        $("#f_add").get(0).reset();
    },

    modalPrecio: function(id){
        $("#f_precio").get(0).reset();
    },

    actualizarStock: function(){
        var json,
            cantidad = this.agregarStock.val(),
            valido = true;

        $(".has-error").removeClass("has-error");

        if(!type.isNumber(parseInt(this.numFact.val()))){
            valido = false;
            this.numFact.siblings("span.help-block").text("Campo obligatorio");
            this.numFact.parent().addClass("has-error");
        }else if( parseInt(this.numFact.val()) <= 0 ){
            valido = false;
            this.numFact.siblings("span.help-block").text("El numero de factura no puede ser menor que 1");
            this.numFact.parent().addClass("has-error");
        }

        if(!type.isNumber(parseInt(cantidad))){
            valido = false;
            this.agregarStock.siblings("span.help-block").text("Campo obligatorio");
            this.agregarStock.parent().addClass("has-error");
        }else if( parseInt(this.agregarStock.val()) <= 0 ){
            valido = false;
            this.agregarStock.siblings("span.help-block").text("El stock a ingresar no puede ser menor a 1");
            this.agregarStock.parent().addClass("has-error");
        }else if(parseInt(cantidad) > this.cantidadActual && this.modo === this.VENDER){
            valido = false;
            this.agregarStock.siblings("span.help-block").text("La cantidad a quitar es mayor que el monto actual");
            this.agregarStock.parent().addClass("has-error");
        }

        if(!valido){
            return;
        }

        $("#ajax_load").css("visibility","visible");

        json = {
            id : this.id,
            num_fact : this.numFact.val(),
            agregar_stock : this.agregarStock.val(),
            accion : this.modo
        };

        $.post($("#f_add").attr("action"), json, this.procesarDataStock());
    },

    actualizarPrecio: function(){
        var json, valido = true;

        if(!type.isNumber(parseInt(this.precio.val()))){
            valido = false;
            this.precio.siblings("span.help-block").text("Debe ingresar un numero");
            this.precio.parent().addClass("has-error");
        }else if(parseInt(this.precio.val()) < 1){
            valido = false;
            this.precio.siblings("span.help-block").text("Debe ingresar un precio mayor que 0");
            this.precio.parent().addClass("has-error");
        }

        if(!valido){
            return;
        }

        json = {
            id : this.id,
            precio : this.precio.val()
        };

        $.post($("#f_precio").attr("action"), json, this.procesarDataPrecio());
    },

    procesarDataStock: function(id){
        var _this = this;

        return function(data){
            $("#ajax_load").css("visibility","hidden");
            $("#stock_" + _this.id).text(data);
            $("#modal_add").modal('toggle');

            _this.agregarMensaje("Los cambios han sido guardados exitosamente");
        };
    },

    procesarDataPrecio: function(){
        var _this = this;

        return function(data){
        	console.log(data);
            $("#precio_" + _this.id).text(_this.precio.val());
            $("#modal_precio").modal("toggle");
            _this.agregarMensaje("Precio actualizado");
        };
    },

    agregarMensaje: function(mensaje){
        var _this = this;
        this.mensaje.addClass("alert-success").show().text(mensaje);

        setTimeout(function(){
            _this.mensaje.removeClass("alert-success").hide().text("");
        },2500);
    }
}
