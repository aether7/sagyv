App.Controllers.Vehiculo = function(){
    this.id = null;
    this.idVehiculo = null;
    this.vehiculos = [];
};

App.Controllers.Vehiculo.prototype = {
    constructor: App.Controllers.Vehiculo,

    validarNuevoVehiculo: function(viewData){
        var action,
            vehiculo = new App.Models.Vehiculo();

        vehiculo.numero = viewData.numero;
        vehiculo.patente = viewData.patente;
        vehiculo.revisionTecnica = viewData.fechaRev;
        vehiculo.kilometraje = viewData.kilometraje;
        vehiculo.estadoSec = viewData.estadoSec;
        vehiculo.estadoPago = viewData.estadoPago;
        vehiculo.chofer = viewData.chofer;

        if(!vehiculo.esValido()){
            pubsub.publish("vehiculo:noValido", [ vehiculo.getErrorList() ]);
            return;
        }

        action = App.urls.get("vehiculos:nuevo");

        $.post(action, vehiculo.getJSON(), function(data){
            pubsub.publish("vehiculo:procesarNuevo", [ data ]);
        });
    },

    validarEdicionVehiculo: function(viewData){
        var action,
            vehiculo = new App.Models.Vehiculo();

        vehiculo.id = viewData.id;
        vehiculo.numero = viewData.numero;
        vehiculo.patente = viewData.patente;
        vehiculo.revisionTecnica = viewData.fechaRev;
        vehiculo.kilometraje = viewData.kilometraje;
        vehiculo.estadoSec = viewData.estadoSec;
        vehiculo.estadoPago = viewData.estadoPago;
        vehiculo.chofer = viewData.chofer;

        if(!vehiculo.esValido()){
            pubsub.publish("vehiculo:noValido", [vehiculo.getErrorList() ]);
            return;
        }

        action = App.urls.get("vehiculos:editar");

        $.post(action, vehiculo.getJSON(), function(data){
            pubsub.publish("vehiculo:procesarEditar", [ data ]);
        });
    },

    guardarAnexar: function(numero, chofer, fecha, idVehiculo){
        var action,
            json,
            valido = true,
            errorList = [];

        if(numero === ""){
            valido = false;
            errorList.push({
                campo: "numero",
                mensaje: "campo obligatorio"
            });
        }else if(isNaN(numero)){
            valido = false;
            errorList.push({
                campo: "numero",
                mensaje: "Ingrese número válido"
            });
        }

        if(chofer === ""){
            valido = false;
            errorList.push({
                campo: "chofer",
                mensaje: "campo obligatorio"
            });
        }

        if(fecha === ""){
            valido = false;
            errorList.push({
                campo: "fecha",
                mensaje: "campo obligatorio"
            });
        }

        if(!valido){
            pubsub.publish("vehiculo:noValidoAnexar", [ errorList ]);
            return;
        }

        action = App.urls.get("vehiculos:anexar");

        json = {
            id: idVehiculo,
            chofer: chofer,
            fecha: fecha,
            numero: numero
        };

        $.post(action, json, function(data){
            pubsub.publish("vehiculo:procesarAnexar", [ data ]);
        });
    }
};
