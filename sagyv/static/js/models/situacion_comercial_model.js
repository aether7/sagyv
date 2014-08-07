App.Models.SituacionComercial = function(){
    this.id = null;
    this.monto = null;
    this.tipo = null;
    this.producto = null;
    this.errorList = [];
};

App.Models.SituacionComercial.prototype = {
    constructor : App.Models.SituacionComercial,

    esValido: function(){
        var valido = true;

        if(this.monto.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "monto",
                mensaje : "campo obligatorio"
            });
        }else if( !/^\d+$/.test(this.monto) || !type.isNumber(parseInt(this.monto))){
            valido = false;

            this.errorList.push({
                campo : "monto",
                mensaje : "Solo se deben agregar números"
            });
        }else if(parseInt(this.monto) < 1){
            valido = false;

            this.errorList.push({
                campo : "monto",
                mensaje : "Debe ingresar un monto mayor a 1"
            });
        }

        if(this.tipo.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "tipo",
                mensaje : "campo obligatorio"
            });
        }

        if(this.producto.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "producto",
                mensaje : "campo obligatorio"
            });
        }

        return valido;
    },

    getJSON: function(){
        var json = {
            tipo : parseInt(this.tipo),
            valor : parseInt(this.monto),
            producto : parseInt(this.producto)
        };

        if(this.id){
            json.id = parseInt(this.id);
        }

        return json;
    },

    getErrorList: function(){
        return this.errorList;
    }
};
