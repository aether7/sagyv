App.Controllers.Precio = function(){
    this.UP = 38;
    this.DOWN = 40;
    this.btnBodega = $("#guardar_precio_llenos");
};

App.Controllers.Precio.prototype = {
    constructor: App.Controllers.Precio,

    init: function(){
        $("[data-columna-normal]").on("keyup", this.moverInputs("Normal"));
        $("[data-columna-garantias]").on("keyup", this.moverInputs("Garantias"));

        $("#f_stock").on("submit", this.actualizarStocks());
        $("#f_precio_masivo").on("submit", this.actualizarPrecios("normal", "f_precio_masivo"));
        $("#f_precio_masivo_garantias").on("submit", this.actualizarPrecios("garantias", "f_precio_masivo_garantias"));
    },

    moverInputs: function(modo){
        var _this = this;

        return function(evt){
            var valor, numeroActual = parseInt($(this).data("columna" + modo));

            if(evt.which === _this.UP && numeroActual > 1){
                numeroActual--;
            }else if(evt.which === _this.DOWN){
                numeroActual++;
            }else{
                valor = $(this).val().replace(/\D/gi, "");
                $(this).val(valor);
            }

            $("[data-columna-{0}={1}]".format(modo.toLowerCase(), numeroActual)).trigger("focus");
        };
    },

    actualizarPrecios: function(modo, idForm){

        return function(evt){
            evt.preventDefault();

            $(".has-error").removeClass("has-error");
            $(".help-block").text("");

            var datos,
                precios = [],
                valido = true;

            $("[data-columna-{0}]".format(modo)).each(function(){
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
                $("[data-columna-{0}]".format(modo)).each(function(){
                    var valorActual = $(this).val() || 0,
                        valorAnterior = $(this).closest("tr").find("span[data-actual=true]"),
                        id = $(this).data("id");

                    if(valorActual){
                        $("#precio_{0}".format(id)).text(valorActual);
                    }

                    valorAnterior.text(valorActual);
                });

                common.agregarMensaje("Los precios han sido actualizados exitosamente");
                $("#" + idForm).get(0).reset();
            });
        };
    },

    actualizarStocks: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();

            var stocks = [],
                action = $(this).attr("action"),
                valido = true;

            $(this).find(".text-danger").text("");

            $(this).find("input[type=text]").each(function(){
                var id = $(this).data("id"),
                    nuevoStock = parseInt($(this).val());

                if(isNaN(nuevoStock)){
                    $(this).siblings("span").text("Número no válido");
                    valido = false;
                    return;
                }else if(nuevoStock < 1){
                    valido = false;
                    $(this).siblings("span").text("La cantidad debe al menos ser 1");
                    return;
                }

                stocks.push({
                    id: id,
                    stock: nuevoStock
                });
            });

            if(!valido){
                return;
            }

            $(this).find("input[type=text").val("");

            $.post(action, { productos: JSON.stringify(stocks) }, function(data){
                _this.procesarActualizacionStock(stocks);
                common.agregarMensaje("Los stocks han sido actualizados exitosamente");
            });
        }
    },

    procesarActualizacionStock: function(stocks){
        stocks.forEach(function(producto){
            var fila = $("#producto_stock_" + producto.id).closest("tr");
            fila.find("td:eq(1)").text(producto.stock);
        });
    }
};
