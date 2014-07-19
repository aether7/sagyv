var common = {
    agregarMensaje: function(mensaje){
        var $mensaje = $("#mensaje").addClass("alert-success").show().text(mensaje);

        setTimeout(function(){
            $mensaje.removeClass("alert-success").hide().text("");
        },2500);
    }
};
