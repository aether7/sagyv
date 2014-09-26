var Otro = function(){
    this.concepto = null;
    this.monto = null;

    this.mensajes={};
};

Otro.mixin({
    getJSON: function(){
        var json = {
            concepto : this.concepto,
            monto : this.monto
        };

        return json;
    },

    esValido: function(){
        var valido = true;

        valido = this.esMontoValido() && valido;
        valido = this.esConceptoValido() && valido;

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }

        return valido;
    },

    esConceptoValido: function(){
        var valido = true;
        this.mensajes.concepto = "";

        if(this.concepto == null || this.concepto.trim() == ""){
            valido = false;
            this.mensajes.concepto = "campo obligatorio";
        }

        return valido;
    },

    esMontoValido: function(){
        return this._esNumeroValido("monto");
    }

});

module.exports = Otro;
