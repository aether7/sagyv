function Garantia(){
    this.id = null;
    this.codigo = null;
    this.valor = 0;
    this.cantidad = 0;
    this.mensajes = {};
}

Garantia.prototype = {
    constructor: Garantia,

    _esNumeroValido: function(campo){
        if(!this[campo]){
            this[campo] = 0;
        }else if(isNaN(this[campo])){
            this.mensajes[campo] = "el valor debe ser numérico";
            return false;
        }else if(parseInt(this[campo]) < -1){
            this.mensajes[campo] = "el valor debe ser positivo";
            return false;
        }

        return true;
    },

    _esCantidadValido: function(){
        return this._esNumeroValido('cantidad');
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this._esCantidadValido() && valido;

        return valido;
    }
};

module.exports = Garantia;
