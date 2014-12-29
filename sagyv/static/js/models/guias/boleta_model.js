function Boleta(){
    this.id = null;
    this.inicial = 0;
    this.ultima = 0;
    this.actual = 0;

    this.trabajador = {
        id: 0,
        nombre: null
    };

    this.mensajes = {};
}

Boleta.prototype = {
    constructor: Boleta,

    esValido: function(){
        var valido = true;

        this.mensajes = {};

        valido = this.esInicialValido() && valido;
        valido = this.esUltimaValido() && valido;
        valido = this.esTrabajadorValido() && valido;

        return valido;
    },

    esInicialValido: function(){
        if(!this.inicial || isNaN(this.inicial)){
            this.mensajes.inicial = 'Campo obligatorio';
            return false;
        }else if(parseInt(this.inicial) < 1){
            this.mensajes.inicial = 'El número de boleta inicial debe al menos ser 1';
            return false;
        }

        return true;
    },

    esUltimaValido: function(){
        if(!this.ultima || isNaN(this.ultima)){
            this.mensajes.ultima = 'Campo obligatorio';
            return false;
        }else if(parseInt(this.ultima) < 1){
            this.mensajes.ultima = 'El número de boleta final debe al menos ser 1';
            return false;
        }else if(parseInt(this.inicial) >= parseInt(this.ultima)){
            this.mensajes.inicial = 'El número de boleta final debe ser mayor a la boleta inicial';
            this.mensajes.ultima = 'El número de boleta final debe ser mayor a la boleta inicial';
            return false;
        }

        return true;
    },

    esTrabajadorValido: function(){
        if(!this.trabajador.id){
            this.mensajes.trabajador = 'Campo obligatorio';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            id: this.id,
            inicial: this.inicial,
            ultima: this.ultima,
            actual: this.actual,
            trabajador: JSON.stringify(this.trabajador)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = Boleta;
