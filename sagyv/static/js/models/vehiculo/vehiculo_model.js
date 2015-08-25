function Vehiculo(){
    this.id = null;
    this.numero = null;
    this.patente = null;
    this.kilometraje = 0;
    this.fechaRevision = null;
    this.estadoSec = null;
    this.estadoPago = null;
    this.chofer = {};

    this.mensaje = {};
}

Vehiculo.prototype = {
    constructor: Vehiculo,

    addData: function(data){
        this.id = data.id;
        this.numero = data.movil.numero;
        this.patente = data.patente;
        this.kilometraje = data.km;
        this.fechaRevision = common.fecha.jsonToDate(data.fechaRevisionTecnica);
        this.estadoSec = data.estadoSec;
        this.estadoPago = data.estadoPago;
        this.chofer = data.chofer;
    },

    esValido: function(){
        var valido = true;
        this.mensaje = {};

        valido = this.esNumeroValido() && valido;
        valido = this.esPatenteValida() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esKilometrajeValido() && valido;

        return valido;
    },

    esNumeroValido: function(){
        if(!this.numero || isNaN(this.numero)){
            this.mensaje.numero = 'Campo inválido';
            return false;
        }else if(parseInt(this.numero) < 1){
            this.mensaje.numero = 'Ingrese numero mayor a 0';
            return false;
        }

        return true;
    },

    esPatenteValida: function(){
        var formato1 = /^[A-z]{4}\d{2}$/,
            formato2 = /^[A-z]{2}\d{4}$/;

        if(!formato1.test(this.patente) && !formato2.test(this.patente)){
            this.mensaje.patente = 'Patente inválida';
            return false;
        }

        return true;
    },

    esFechaValida: function(){
        if(!this.fechaRevision){
            this.mensaje.fechaRevision = 'Fecha obligatoria';
            return false;
        }

        return true;
    },

    esKilometrajeValido: function(){
        if(isNaN(this.kilometraje)){
            this.mensaje.kilometraje = 'Campo inválido';
            return false;
        }else if(parseInt(this.kilometraje) < 0){
            this.mensaje.kilometraje = 'Ingrese numero mayor o igual a 0';
            return false;
        }

        return true;
    },

    getNombreChofer: function(){
        if(this.chofer.id){
            return this.chofer.nombre;
        }else{
            return 'No anexado';
        }
    },

    toJSON: function(){
        var json = {
            numero: this.numero,
            patente: this.patente,
            kilometraje: this.kilometraje,
            fechaRevisionTecnica: common.fecha.fechaToJSON(this.fechaRevision),
            estadoSec: this.estadoSec,
            estadoPago: this.estadoPago
        };

        if(this.chofer.id){
            json.chofer = JSON.stringify(this.chofer);
        }else{
            json.chofer = JSON.stringify({ id: 0, nombre: '' });
        }

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = Vehiculo;
