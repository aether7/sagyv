App.Controllers.Vehiculo = function(){
    this.btnNuevoVehiculo = $("#btn_nuevo_vehiculo");
    this.btnGuardarNuevoVehiculo = $("#btn_guardar_nuevo_vehiculo");
    this.btnGuardarEdicionVehiculo = $("#btn_editar_vehiculo");
    this.vehiculos = [];
    this.id = null;
    this.idVehiculo = null
};

App.Controllers.Vehiculo.prototype = {
    constructor: App.Controllers.Vehiculo,
    init: function(){
        var _this = this;

        this.btnNuevoVehiculo.on("click",function(){
            _this.mostrar("modal_nuevo_vehiculo", "f_nuevo_vehiculo");
        });

        this.btnGuardarNuevoVehiculo.on("click", this.validarNuevoVehiculo());
        this.btnGuardarEdicionVehiculo.on("click", function(){
            _this.guardarEdicionVehiculo()
        });

        $("#lista_vehiculos").on("click", ".btn-acciones", function(evt){
            evt.preventDefault();
            var accion = $(this).data("accion"),
                id = $(this).data("id");

            _this.id = id;
            _this.mostrar("modal_" + accion,"f_" + accion);
            _this[accion](id);
        });

        $("#btn_anexar").on("click", function(evt){
            evt.preventDefault();
            _this.guardarAnexar();
        });
    },

    agregarVehiculo: function(vehiculoNumero, vehiculoPatente){
        this.vehiculos.push({
            numero : vehiculoNumero,
            patente : vehiculoPatente
        });
    },

    mostrar: function(id,reseteo){
        $("#" + id).modal("toggle");

        if(reseteo){
            $("#" + reseteo).get(0).reset();
        }
    },

    anexar: function(){
        var url = App.urls.get("vehiculos:obtener").replace("0", this.id);

        $.get(url, function(data){
            $("#anexar_vehiculo").val(data.numero).data("id", data.id);
        });
    },

    guardarAnexar: function(){
        var json,
            _this = this,
            valido = true,
            vehiculo = $("#anexar_vehiculo"),
            chofer = $("#anexar_chofer"),
            fecha = $("#anexar_fecha");

        $(".has-error").removeClass("has-error");
        $("span.help-block").text("");

        if(chofer.val() === ""){
            valido = false;
            chofer.siblings("span").text("campo obligatorio");
            chofer.parent().addClass("has-error");
        }

        if(fecha.val() === ""){
            valido = false;
            fecha.siblings("span").text("campo obligatorio");
            fecha.parent().addClass("has-error");
        }

        if(!valido){
            return;
        }

        json = {
            id : vehiculo.data("id"),
            chofer : parseInt(chofer.val()),
            fecha : fecha.val()
        };

        $.post($("#f_anexar").attr("action"), json, function(data){
            var tdChofer,
                tdAntiguoChofer,
                mensaje = "El conductor {0} ha sido anexado exitosamente al vehiculo {1}";

            tdAntiguoChofer = $("td[data-nombre-chofer='{1}']".format(_this.id, data.nombre_chofer));
            tdAntiguoChofer.data("nombreChofer", "No anexado").
                attr("data-nombre-chofer", "No anexado").
                text("No anexado");

            tdChofer = $("#vehiculo_" + _this.id).find("[data-nombre-chofer]");
            tdChofer.data("nombreChofer", data.nombre_chofer).attr("data-nombre-chofer", data.nombre_chofer);
            tdChofer.text(data.nombre_chofer);

            mensaje = mensaje.format(data.nombre_chofer, data.numero_vehiculo);
            _this.enviarMensaje(mensaje);

            $("#modal_anexar").modal("hide");
        });
    },

    enviarMensaje: function(mensaje){
        var $mensaje = $("#mensaje");
        $mensaje.css("visibility","visible").text(mensaje);

        setTimeout(function(){
            $mensaje.css("visibility","hidden").text("");
        },2500);
    },

    validarNuevoVehiculo: function(){
        var _this = this,
            numero = $("#numero_vehiculo_nuevo"),
            patente = $("#patente_vehiculo_nuevo"),
            fechaRev = $("#revision_tecnica_vehiculo_nuevo"),
            kilometraje = $("#kilometraje_vehiculo_nuevo"),
            estadoSec = $("#estado_sec_vehiculo_nuevo"),
            estadoPago = $("#estado_pago_vehiculo_nuevo"),
            chofer = $("#chofer_vehiculo_nuevo");

        return function(){
            var json, valido = true;

            valido = _this.validarCampo(numero, patente, fechaRev, kilometraje, estadoSec, estadoPago, chofer, true);

            if(!valido){
                return;
            }

            json = {
                numero : numero.val(),
                patente : patente.val(),
                revision_tecnica : fechaRev.val(),
                kilometraje : kilometraje.val(),
                estado_sec : estadoSec.val(),
                estado_pago : estadoPago.val(),
                chofer : chofer.val()
            };

            $.post($("#f_nuevo_vehiculo").attr("action"), json, function(data){
                _this.mostrar("modal_nuevo_vehiculo");
                _this.enviarMensaje("El vehículo se ha registrado exitosamente");
                json.id = data.id_vehiculo;
                json.chofer = data.chofer;

                _this.generarVehiculoLista(json);
            });
        };
    },

    estaRepetidoVehiculo: function(tipo, valor){
        var repetido = false;

        this.vehiculos.forEach(function(elem){
            if(elem[tipo] == valor){
                repetido = true;
            }
        });

        return repetido;
    },

    generarVehiculoLista: function(json){
        var lista = $("#lista_vehiculos tbody"),
            template = $("#tmpl_nuevo_vehiculo").html(),
            render = Handlebars.compile(template),
            vehiculo = {},
            meses = new Array("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"),
            fechaTmp = json.revision_tecnica.split("-");

            if(fechaTmp[1] < 10)
                fechaTmp[1] = fechaTmp[1].replace('0','');
            fecha = fechaTmp[2]+" de "+ meses[fechaTmp[1]] +" de "+fechaTmp[0];

        vehiculo.id = json.id;
        vehiculo.numero = json.numero;
        vehiculo.patente = json.patente;
        vehiculo.km = json.kilometraje;
        vehiculo.fecha_revision_tecnica = fecha;
        vehiculo.estado_sec = json.estado_sec;
        vehiculo.estado_pago = json.estado_pago;
        vehiculo.get_ultimo_chofer = json.chofer;

        if(json.estado_sec == 0){
            vehiculo.estado_sec = false;
        }

        if(json.estado_pago == 0){
            vehiculo.estado_pago = false;
        }


        lista.append(render({ vehiculo : vehiculo }));
    },

    editar: function(id_vehiculo){
        var url = App.urls.get("vehiculos:obtener").replace("0", id_vehiculo);
        this.idVehiculo = id_vehiculo;

        $.get(url, function(data){
            var fecha = data.fecha_revision_tecnica.split("-");

            if(parseInt(fecha[1]) < 10){
                fecha[1] = "0" + fecha[1];
            }

            if(parseInt(fecha[2]) < 10){
                fecha[2] = "0" + fecha[2];
            }

            fecha = fecha.join("-");
            console.log("SEC : "+(data.estado_sec)?1:2);
            $("#numero_vehiculo_editar").val(data.numero);
            $("#patente_vehiculo_editar").val(data.patente);
            $("#revision_tecnica_vehiculo_editar").val(fecha);
            $("#kilometraje_vehiculo_editar").val(data.km);
            $("#estado_sec_vehiculo_editar").val((data.estado_sec)?1:0);
            $("#estado_pago_vehiculo_editar").val((data.estado_pago)?1:0);
            $("#chofer_vehiculo_editar").val(data.chofer);
        });
    },

    guardarEdicionVehiculo:function(){
        var numero = $("#numero_vehiculo_editar"),
            patente = $("#patente_vehiculo_editar"),
            fecha = $("#revision_tecnica_vehiculo_editar"),
            km = $("#kilometraje_vehiculo_editar"),
            sec = $("#estado_sec_vehiculo_editar"),
            estadoPago = $("#estado_pago_vehiculo_editar"),
            idChofer = $("#chofer_vehiculo_editar")
            _this = this;

        valido = this.validarCampo(numero, patente, fecha, km, sec, estadoPago, idChofer);

        if(!valido){
            return;
        }

        json = {
            id_vehiculo : this.id,
            fecha_revision_tecnica : fecha.val(),
            estado_sec : sec.val(),
            estado_pago : estadoPago.val(),
            id_chofer : idChofer.val()
        };

        $.post($("#f_editar").attr("action"), json, function(data){
            var url = App.urls.get("vehiculos:obtener_vehiculos");

            $.get(url, function(listaVehiculos){
                _this.procesarDatosVehiculos(listaVehiculos);
                _this.enviarMensaje("El vehiculo {0} se ha editado exitosamente".format(numero.val()));
                $("#modal_editar").modal("hide");
            });
        });
    },

    procesarDatosVehiculos: function(listaVehiculos){
        var render = Handlebars.compile($("#tmpl_nuevo_vehiculo").html()),
            meses = new Array("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"),
            tabla = $("#lista_vehiculos tbody");
        tabla.empty();

        listaVehiculos.forEach(function(v){
            fechaTmp = v.fecha_revision_tecnica.split('-');

            if(fechaTmp[1] < 10)
                fechaTmp[1] = fechaTmp[1].replace('0','');

            v.fecha_revision_tecnica = fechaTmp[2]+" de "+ meses[fechaTmp[1]] +" de "+fechaTmp[0];
            tabla.append(render({ vehiculo : v }));
        });
    },

    validarCampo: function(numero, patente, fechaRev, kilometraje, estadoSec, estadoPago, chofer, validacionRepetido){
        var valido = true,
            validacionRepetido = validacionRepetido || false;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(!type.isNumber(parseInt(numero.val()))){
            valido = false;
            numero.siblings("span.help-block").text("Ingrese número válido");
            numero.parent().addClass("has-error");
        }else if(this.estaRepetidoVehiculo("numero", numero.val()) && validacionRepetido){
            valido = false;
            numero.siblings("span.help-block").text("El número de vehículo ya está siendo utilizado");
            numero.parent().addClass("has-error");
        }

        if(!/^[A-z]{4}\d{2}$/.test(patente.val()) && !/^[A-z]{2}\d{4}$/.test(patente.val())){
            valido = false;
            patente.siblings("span.help-block").text("Ingrese patente válida");
            patente.parent().addClass("has-error");
        }else if(this.estaRepetidoVehiculo("patente", patente.val()) && validacionRepetido){
            valido = false;
            patente.siblings("span.help-block").text("La patente ya está siendo utilizada");
            patente.parent().addClass("has-error");
        }

        if(!/^\d{4}-\d{2}-\d{2}$/.test(fechaRev.val())){
            valido = false;
            fechaRev.siblings("span.help-block").text("Ingrese fecha válida");
            fechaRev.parent().addClass("has-error");
        }

        if(!type.isNumber(parseInt(kilometraje.val()))){
            valido = false;
            kilometraje.siblings("span.help-block").text("Ingrese kilometraje numérico");
            kilometraje.parent().addClass("has-error");
        }else if(parseInt(kilometraje.val()) < 0){
            valido = false;
            kilometraje.siblings("span.help-block").text("El kilometraje debe ser un número positivo");
            kilometraje.parent().addClass("has-error");
        }

        return valido;

    }
};
