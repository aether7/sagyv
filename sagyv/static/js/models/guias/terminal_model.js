function Terminal(){
    this.id = null;
    this.codigo = null;
    this.movil = {};
    this.estado = {};

    this.mensajes = {};
}

Terminal.prototype = {
    constructor: Terminal,

    addData: function(terminal){
        this.id = terminal.id;
        this.codigo = terminal.codigo;
        this.movil = terminal.movil;
        this.estado = terminal.estado;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this.esCodigoValido() && valido;
        valido = this.esVehiculoValido() && valido;

        return valido;
    },

    esCodigoValido: function(){
        var regexCodigo = /^[a-z]*\d+[a-z]*\d*$/i;

        if(!this.codigo){
            this.mensajes.codigo = 'Campo obligatorio';
            return false;
        }else if(!regexCodigo.test(this.codigo)){
            this.mensajes.codigo = 'Código de terminal inválido';
            return false;
        }

        return true;
    },

    esVehiculoValido: function(){
        if(!this.movil.id){
            this.mensajes.movil = 'Campo obligatorio';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            codigo: this.codigo,
            movil: JSON.stringify(this.movil),
            estado: JSON.stringify(this.estado)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    resetearMovil: function(){
        this.movil = {
            id: 0,
            numero: null
        };
    }
};

module.exports = Terminal;
