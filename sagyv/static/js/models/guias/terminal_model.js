function Terminal(){
    this.id = null;
    this.codigo = null;
    this.movil = {};
    this.estado = {};

    this.mensajes = {};
}

Terminal.mixin({
    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this.esCodigoValido() && valido;
        valido = this.esVehiculoValido() && valido;

        return valido;
    },

    esCodigoValido: function(){
        if(!this.codigo){
            this.mensajes.codigo = 'Campo obligatorio';
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
            json.id = id;
        }

        return json;
    }
});

module.exports = Terminal;
