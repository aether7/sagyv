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
        var $modal = $("#modal_" + id);

        $modal.modal("show");
        $modal.find("form").get(0).reset();

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");
    },
};
