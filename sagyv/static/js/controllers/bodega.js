App.Controllers.Bodega = function(){
    this.AGREGAR = 1;
    this.VENDER = 2;
    this.modo = null;
    this.mensaje = $("#mensaje");
    this.numFact = $("#factura_add");
    this.agregarStock = $("#cantidad_add");
    this.tituloModal = $("#titulo_modal");
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

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        $("#modal_add_id").val(id);
        $("#modal_add").modal('toggle');

        $("#f_add").get(0).reset();
    },

    accion: function(){
        var json, valido = true;
        this.id = $("#modal_add_id").val();

        $(".has-error").removeClass("has-error");

        if(this.numFact.val().trim() === "" || isNaN(this.numFact.val())){
            valido = false;
            this.numFact.siblings("span.help-block").text("Campo obligatorio");
            this.numFact.parent().addClass("has-error");
        }

        if(this.agregarStock.val().trim() === "" || isNaN(this.agregarStock.val())){
            valido = false;
            this.agregarStock.siblings("span.help-block").text("Campo obligatorio");
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
