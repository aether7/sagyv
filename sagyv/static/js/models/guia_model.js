App.Models.Guia = function(){
    this.id = null;
    this.numero = null;
    this.factura = null;
    this.vehiculo = null;
    this.fecha = null;
    this.productos = []; //siempre debe comenzar con una nueva lista de productos

    this.mensajes = {};
};

App.Models.Guia.prototype = {
    construtor: App.Models.Guia,

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) > 0){
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

    esNumeroValido: function(){
        return this._esNumeroValido('numero');
    },

    esFacturaValida:function(){
        return this._esNumeroValido('factura');
    },

    esVehiculoValido:function(){
        return this._esNumeroValido('vehiculo');
    },

    esFechaValida:function(){
        return this._esFechaValida('fecha');
    },

    esProductosValido:function(){
        var valido = true;

        if(this.productos.length < 1){
            valido = false;
        }

        return valido;
    },

    esValida: function(){
        var valido = true;

        valido = this.esNumeroValido() && valido;
        valido = this.esVehiculoValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductosValido() && valido;

        return valido;
    }
};
