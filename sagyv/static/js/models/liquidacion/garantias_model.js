var Garantias = function(){
    this.id = null;
    this.codigo = null;
    this.valor = 0;
    this.cantidad = 0;
    this.mensajes = {};
};

Garantias.mixin({

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            this[campo] = 0;
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < -1){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    esCantidadValido : function(){
        return this._esNumeroValido('cantidad');
    },

    esValido : function(){
        valido = true;
        valido = this.esCantidadValido() && valido;

        return valido;
    },

});

module.exports = Garantias;
