var CuponPrepago = function(){
    this.numero = null;
    this.clienteId = null;
    this.clienteNombre = null;
    this.formatoNombre = null;
    this.formato = null;
    this.descuento = null;

    this.mensajes = {};
};

CuponPrepago.mixin({
    getJSON: function(){
        var json = {
            cliente: {
                id : this.clienteId,
                nombre : this.clienteNombre
            },
            formato: {
                id : this.formato,
                nombre: this.formatoId
            },
            numero: this.numero,
            descuento: this.descuento
        };

        return json;
    },

    esValido: function(){
        var valido = true;

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

    esValidoNumero: function(){
        return this._esNumeroValido("numero");
    },

    esValidoClienteId: function(){
        var valido = true;
        this.mensajes.clienteId = "";

        if(!this.clienteId){
            valido = false;
            this.mensajes.clienteId = "campo obligatorio";
        }

        return valido;
    },

    esValidoFormato: function(){
        var valido = true;
        this.mensajes.formato = ""

        if(!this.formato){
            valido = false;
            this.mensajes.clienteId = "campo obligatorio";
        }

        return valido;
    },

    esValidoDescuento: function(){
        return this._esNumeroValido("descuento");
    },

    clearData: function(){
        this.numero = null;
        this.clienteId = null;
        this.clienteNombre = null;
        this.formato = null;
        this.descuento = null;
    }

});

module.exports = CuponPrepago;
