App.Models.Guia = function(){
    this.id = null;
    this.numero = null;
    this.factura = null;
    this.movil = null;
    this.fecha = null;
    this.productos = null;

    this.mensajes = {};
};

App.Models.Guia.prototype = {
    construtor: App.Models.Guia

    _esNumeroValido: function(campo, customMje){
        var valido = true

        this.mensajes[campo] = "";
        if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numerico";
        }else if(this[campo] == ''){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(this[campo] > 0){
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
        return this._esNumeroValido('numero', 'campo obligatorio');
    },

    esFacturaValida:function(){
        return this._esNumeroValido('factura', 'campo obligatorio');
    },

    esMovilValido:function(){
        return this._esNumeroValido('movil', 'campo obligatorio');
    },

    esFechaValida:function(){
        return this._esFechaValida('fecha', 'campo obligatorio');
    },

    esProductosValido:function(){
        var valido = true;
        if(this.productos.length < 1){
            valido = false;
        }

        return valido;
    },

    esValido: function(){
        var valido = true;

        if( this.esNumeroValido() || this.esFacturaValida() ){
            valido = true;
        }
        valido = this.esMovilValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductosValido() && valido;

        return valido;
    }
};
