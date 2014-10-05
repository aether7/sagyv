var common = {
    constantes: {
        regex : {
            direccion : /^[A-záéíóúñÁÉÍÓÚÑ\s]+\s((#|Nº|No)\d+)|(s\/n)$/i,
            noNombre : /[^A-záéíóúñÁÉÍÓÚÑ\s]+/g,
            nombre : /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]$/i,
        },

        mensajes : {
            obligatorio : "campo obligatorio"
        }
    },

    mostrarErroresVista: function(dict, errorList){
        errorList.forEach(function(err){
            var $obj = dict[err.campo];

            $obj.siblings("span").text(err.mensaje);
            $obj.parent().addClass("has-error");
        });
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

    fecha: {
        agregarCeros: function(txt){
            var aux = txt.split("-"),
                anio = aux[0],
                mes = parseInt(aux[1], 10) < 10 ? "0" + aux[1].replace(/^0/, "") : aux[1],
                dia = parseInt(aux[2], 10) < 10 ? "0" + aux[2].replace(/^0/, "") : aux[2];

            return anio + "-" + mes + "-" + dia;
        },

        formatearFecha: function(txt){
            var aux = txt.split("-"),
                anio = aux[0],
                mes = parseInt(aux[1], 10) < 10 ? "0" + aux[1].replace(/^0/, "") : aux[1],
                dia = parseInt(aux[2], 10) < 10 ? "0" + aux[2].replace(/^0/, "") : aux[2];

            return dia + "-" + mes + "-" + anio;
        },

        convertirFechaTextual: function(txt){
            var mes,
                aux = txt.split("-"),
                anio = aux[0],
                dia = aux[2],
                meses = [
                    "Enero", "Febrero", "Marzo",
                    "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre",
                    "Octubre", "Noviembre", "Diciembre"
                ];

            mes = "de " + meses[parseInt(aux[1]) - 1] + " de"
            return dia + " " + mes + " " + anio;
        },

        fechaToJSON: function(fecha){

            var anio = fecha.getFullYear(),
                mes = fecha.getMonth() + 1,
                dia = fecha.getDate();

            mes = mes < 10 ? '0' + mes : mes;
            dia = dia < 10 ? '0' + dia : dia;

            return anio + '-' + mes + '-' + dia;
        },

        jsonToDate: function(txt){
            var aux = txt.split("-"),
                date = new Date();

            date.setFullYear(parseInt(aux[0]));
            date.setMonth(parseInt(aux[1], 10) - 1);
            date.setDate(parseInt(aux[2]));

            return date;
        }
    }
};
