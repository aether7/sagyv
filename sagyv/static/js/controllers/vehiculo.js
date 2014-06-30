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
            chofer = $("#chofer_vehiculo_nuevo");

        return function(){
            var json, valido = true;

            console.log("entrando");

            $(".has-error").removeClass("has-error");
            $(".help-block").text("");

            if(!type.isNumber(parseInt(numero.val()))){
                console.log(numero.val());

                console.log("1");
                valido = false;
                numero.siblings("span.help-block").text("Ingrese número válido");
                numero.parent().addClass("has-error");
            }

            if(!/^[A-z]{4}\d{2}$/.test(patente.val())){
                console.log(2);
                valido = false;
                patente.siblings("span.help-block").text("Ingrese patente válida");
                patente.parent().addClass("has-error");
            }

            if(!valido){
                return;
            }

            console.log(3);

            json = {
                numero : numero.val(),
                patente : patente.val(),
                chofer : chofer.val()
            };

            $.post($("#f_nuevo_vehiculo").attr("action"), json, function(data){
                console.log(data);
            });
        };
    }
};
