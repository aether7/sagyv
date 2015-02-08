App.Models.Vehiculo = function(){
    this.id = null;
    this.numero = null;
    this.patente = null;
    this.revisionTecnica = null;
    this.kilometraje = null;
    this.estadoSec = 0;
    this.estadoPago = 0;
    this.chofer = null;

    this.errorList = [];
};

App.Models.Vehiculo.prototype = {
    constructor: App.Models.Vehiculo,

    esValido: function(){
        var valido = true,
            regex = {
                formato1: /^[A-z]{4}\d{2}$/,
                formato2: /^[A-z]{2}\d{4}$/,
                fecha: /^\d{4}-\d{2}-\d{2}$/,
                numero: /^\d+$/
            };

        if(!regex.numero.test(this.numero)){
            valido = false;
            this.errorList.push({
                campo: "numero",
                mensaje: "Ingrese un número válido"
            });
        }

        if(!regex.formato1.test(this.patente) && !regex.formato2.test(this.patente)){
            valido = false;
            this.errorList.push({
                campo: "patente",
                mensaje: "Ingrese patente válida"
            });
        }

        if(!regex.fecha.test(this.revisionTecnica)){
            valido = false;
            this.errorList.push({
                campo: "revision_tecnica",
                mensaje: "Ingrese fecha válida"
            });
        }

        if(!regex.numero.test(this.kilometraje)){
            valido = false;
            this.errorList.push({
                campo: "kilometraje",
                mensaje: "Ingrese kilometraje numérico"
            });
        }else if(parseInt(this.kilometraje) < 0){
            valido = false;
            this.errorList.push({
                campo: "kilometraje",
                mensaje: "El kilometraje debe ser un número positivo"
            });
        }

        return valido;
    },

    getErrorList: function(){
        return this.errorList;
    },

    getJSON: function(){

        var json = {
            numero : this.numero,
            patente : this.patente,
            fecha_revision_tecnica : this.revisionTecnica,
            kilometraje : this.kilometraje,
            estado_sec : this.estadoSec,
            estado_pago : this.estadoPago,
            chofer : this.chofer
        };

        if(this.id){
            json.id_vehiculo = this.id;
        }

        return json;
    }
};
