App.Controllers.Bodega = function(){
    this.AGREGAR = 1;
    this.VENDER = 2;
    this.modo = null;
    this.mensaje = $("#mensaje");
    this.numFact = $("#factura_add");
    this.agregarStock = $("#cantidad_add");
    this.tituloModal = $("#titulo_modal");
    this.cantidadActual = null;
    this.id = null;
};

App.Controllers.Bodega.prototype = {
    constructor: App.Controllers.Bodega,

    init: function(){

    },

    showModal: function(id, modo){
        var textoModal = null;
        this.modo = modo;

        if(this.modo === this.AGREGAR){
            textoModal = "Compra de producto";
        }else if(this.modo === this.VENDER){
            textoModal = "Venta de producto";
        }

        this.tituloModal.text(textoModal);
        this.cantidadActual = parseInt($("#stock_" + id).text());

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        $("#modal_add_id").val(id);
        $("#modal_add").modal('toggle');

        $("#f_add").get(0).reset();
    },

    accion: function(){
        var json,
            cantidad = this.agregarStock.val(),
            valido = true;

        this.id = $("#modal_add_id").val();

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

        $.post($("#f_add").attr("action"), json, this.procesarData());
    },

    procesarData: function(id){
        var _this = this;

        return function(data){
            _this.mensaje.addClass("alert-success").show().text("Los cambios han sido guardados exitosamente");

            $("#ajax_load").css("visibility","hidden");
            $("#stock_" + _this.id).text(data);
            $("#modal_add").modal('toggle');

            setTimeout(function(){
                _this.mensaje.removeClass("alert-success").hide().text("");
            },2500);
        };
    }
}
