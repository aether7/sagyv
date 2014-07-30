var common = {
    constantes: {
        regex : {
            direccion : /^[A-záéíóúñÁÉÍÓÚÑ\s]+\s((#|Nº|No)\d+)|(s\/n)$/i
        }
    },

    agregarMensaje: function(mensaje){
        var $mensaje = $("#mensaje").addClass("alert-success").show().text(mensaje);

        setTimeout(function(){
            $mensaje.removeClass("alert-success").hide().text("");
        },2500);
    },

    mostrarModal: function(id){
        var $modal = $("#modal_" + id),
            form = $modal.find("form");

        $modal.modal("show");

        if(form.length){
            form.get(0).reset();
        }

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");
    },

    formatearFecha: function(txt){
        var aux = txt.split("-"),
            anio = aux[0],
            mes = parseInt(aux[1]) < 10 ? "0" + aux[1] : aux[1],
            dia = parseInt(aux[2]) < 10 ? "0" + aux[2] : aux[2];

        return dia + "-" + mes + "-" + anio;
    },

    fecha: {
        agregarCeros: function(txt){
            var aux = txt.split("-"),
                anio = aux[0],
                mes = parseInt(aux[1]) < 10 ? "0" + aux[1] : aux[1],
                dia = parseInt(aux[2]) < 10 ? "0" + aux[2] : aux[2];

            return anio + "-" + mes + "-" + dia;
        },

        formatearFecha: function(txt){
            var aux = txt.split("-"),
                anio = aux[0],
                mes = parseInt(aux[1]) < 10 ? "0" + aux[1] : aux[1],
                dia = parseInt(aux[2]) < 10 ? "0" + aux[2] : aux[2];

            return dia + "-" + mes + "-" + anio;
        }
    }
};
