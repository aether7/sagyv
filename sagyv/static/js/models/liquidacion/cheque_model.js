var Cheque = function(){
    this.banco = null;
    this.nombreBanco = null;
    this.numero = null;
    this.monto = null;
    this.fecha = null;

    this.cheques = [];
    this.mensajes = {};
};

Cheque.mixin({
    getJSON: function(){
        var json = {
            banco: {
                id: this.banco,
                nombre: this.nombreBanco
            },
            numero: this.numero,
            fecha: this.fecha,
            monto: this.monto
        };

        return json;
    },

    esValido: function(){
        var valido = true;

        valido = this.esValidoBanco() && valido;
        valido = this.esValidoNumero() && valido;
        valido = this.esValidoMonto() && valido;
        valido = this.esValidaFecha() && valido;

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    _esFechaValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!type.isDate(this[campo])){
            valido = false;
            this.mensajes[campo] = "fecha inválida";
        }

        return valido;
    },

    esValidoBanco: function(){
        var valido = true;
        this.mensajes.banco = "";

        if(!this.banco){
            valido = false;
            this.mensajes.banco = "campo obligatorio";
        }

        return valido;
    },

    esValidoNumero: function(){
        return this._esNumeroValido("numero");
    },

    esValidoMonto: function(){
        return this._esNumeroValido("monto");
    },

    esValidaFecha:function(){
        return this._esFechaValida("fecha");
    },

    clearData:function(){
        this.banco = null;
        this.numero = null;
        this.monto = null;
        this.fecha = null;
    }
});

module.exports = Cheque;
