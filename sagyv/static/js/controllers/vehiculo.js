App.Controllers.Vehiculo = function(){
    this.btnNuevoVehiculo = $("#btn_nuevo_vehiculo");
    this.btnGuardarNuevoVehiculo = $("#btn_guardar_nuevo_vehiculo");
};

App.Controllers.Vehiculo.prototype = {
    constructor: App.Controllers.Vehiculo,
    init: function(){
        var _this = this;

        this.btnNuevoVehiculo.on("click",function(){
            _this.mostrar("modal_nuevo_vehiculo", "f_nuevo_vehiculo");
        });

        this.btnGuardarNuevoVehiculo.on("click", this.validarNuevoVehiculo());
    },

    mostrar: function(id,reseteo){
        $("#" + id).modal("toggle");
        if(reseteo){
            $("#" + reseteo).get(0).reset();
        }
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

            $(".has-error").removeClass("has-error");
            $(".help-block").text("");

            if(!type.isNumber(parseInt(numero.val()))){
                valido = false;
                numero.siblings("span.help-block").text("Ingrese número válido");
                numero.parent().addClass("has-error");
            }

            if(!/^[A-z]{4}\d{2}$/.test(patente.val())){
                valido = false;
                patente.siblings("span.help-block").text("Ingrese patente válida");
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
                console.log(data);
            });
        };
    }
};
