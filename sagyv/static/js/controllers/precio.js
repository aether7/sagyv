App.Controllers.Precio = function(){
    this.UP = 38;
    this.DOWN = 40;
};

App.Controllers.Precio.prototype = {
    constructor: App.Controllers.Precio,

    init: function(){
        $("[data-columna]").on("keyup",this.moverInputs());
        $("#f_precio_masivo").on("submit",this.actualizarPrecios);
    },

    moverInputs: function(){
        var _this = this;

        return function(evt){
            var valor, numeroActual = parseInt($(this).data("columna"));

            if(evt.which === _this.UP && numeroActual > 1){
                numeroActual--;
            }else if(evt.which === _this.DOWN){
                numeroActual++;
            }else{
                valor = $(this).val().replace(/\D/gi, "");
                $(this).val(valor);
            }

            $("[data-columna={0}]".format(numeroActual)).trigger("focus");
        };
    },

    actualizarPrecios: function(evt){
        evt.preventDefault();

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        var datos,
            precios = [],
            valido = true;

        $("[data-columna]").each(function(){
            var valor = $(this).val(),
                id = $(this).data("id");

            if(!valor || !type.isNumber(parseInt(valor))){
                $(this).siblings("span").text("Campo obligatorio");
                $(this).parent().addClass("has-error");
                valido = false;
                return;
            }

            precios.push({
                id : id,
                valor : valor
            });
        });

        if(!valido){
            return
        }

        datos = { precios : JSON.stringify(precios) };

        $.post($(this).attr("action"), datos, function(data){
            $("[data-columna]").each(function(){
                var valorActual = $(this).val() || 0,
                    valorAnterior = $(this).closest("tr").find("span[data-actual=true]"),
                    id = $(this).data("id");

                if(valorActual){
                    $("#precio_{0}".format(id)).text(valorActual);
                }

                valorAnterior.text(valorActual);
            });

            common.agregarMensaje("Los precios han sido actualizados exitosamente");
            $("#f_precio_masivo").get(0).reset();
        });

    }
};
