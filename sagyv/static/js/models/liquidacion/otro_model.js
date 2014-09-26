var Otro = function(){
    this.consepto = null;
    this.monto = null;

    this.mensajes={};
};

Otro.mixin({
    getJSON: function(){
        var json = {
            consepto : this.consepto,
            monto : this.monto
        };

        return json;
    },

    esValido: function(){
        var valido = true;
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

    esConseptoValido: function(){
        var valido = true;
        this.mensajes.consepto = "";

        if(this.consepto == null){
            valido = false;
            this.mensajes.consepto = "campo obligatorio";
        }

        return valido;
    },

    esMontoValido: function(){
        return this._esNumeroValido("monto");
    }

});

module.exports = Otro;
