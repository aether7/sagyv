function Boleta(){
    this.numeroAnterior = 0;
    this.boletaInicial = 1;
    this.boletaFinal = 0;
    this.id = null;

    this.mensajes = {};
};

Boleta.mixin({
    esValidaBoletaInicial: function(){
        var valido = true;

        if(isNaN(this.boletaInicial)){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta es inválido';
        }else if(this.boletaInicial >= this.boletaFinal){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta inicial debe ser menor a la boleta final';
        }else if(this.boletaInicial < 1){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta mínimo es 1';
        }else if(this.boletaInicial <= this.numeroAnterior){
            valido = false;
            this.mensajes.boletaInicial = 'El número de boleta inicial debe ser mayor a la boleta actual';
        }

        return valido;
    },

    esValidaBoletaFinal: function(){
        var valido = true;

        if(isNaN(this.boletaFinal)){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta es inválido';
        }else if(this.boletaFinal <= this.boletaInicial){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta final debe ser menor a la boleta inicial';
        }else if(this.boletaFinal < 1){
            valido = false;
            this.mensajes.boletaFinal = 'El número de boleta mínimo es 1';
        }

        return valido;
    },

    esValida: function(){
        var valida = true;

        valida = this.esValidaBoletaInicial() && valida;
        valida = this.esValidaBoletaFinal() && valida;

        return valida;
    },

    getJSON: function(){
        var json = {
            boleta_inicial: this.boletaInicial,
            boleta_final: this.boletaFinal,
            id: this.id
        };

        return json;
    }
});

module.exports = Boleta;
