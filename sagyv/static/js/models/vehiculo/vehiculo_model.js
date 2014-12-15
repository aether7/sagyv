function Vehiculo(){
    this.id = null;
    this.numero = null;
    this.patente = null;
    this.kilometraje = 0;
    this.fechaRevision = null;
    this.estadoSec = null;
    this.estadoPago = null;
    this.chofer = null;
}

Vehiculo.mixin({
    addData: function(data){
        this.id = data.id;
        this.numero = data.numero;
        this.patente = data.patente;
        this.kilometraje = data.km;
        this.fechaRevision = data.fechaRevisionTecnica;
        this.estadoSec = data.estadoSec;
        this.estadoPago = data.estadoPago;
        this.chofer = data.chofer;
    },

    toJSON: function(){
        var json = {
            numero: this.numero,
            patente: this.patente,
            kilometraje: this.kilometraje,
            fechaRevisionTecnica: common.fecha.fechaToJSON(this.fechaRevision),
            estadoSec: this.estadoSec,
            estadoPago: this.estadoPago,
            chofer: this.chofer
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
});

module.exports = Vehiculo;
