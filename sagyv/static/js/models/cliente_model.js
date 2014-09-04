App.Models.Cliente = function(){
    this.idCliente = null;
    this.nombre = null;
    this.giro = null;
    this.direccion = null;
    this.telefono = null;
    this.rut = null;
    this.situacionComercial = null;
    this.credito = null;
    this.dispensador = null;
    this.es_lipigas = null;
    this.observacion = null;
    this.cantidad = null;
    this.tipo = null;
    this.producto = null;

    this.errorList = [];
};

App.Models.Cliente.prototype = {
    constructor : App.Models.Cliente,

    esValido: function(){
        var valido = true;

        if(this.nombre.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "nombre",
                mensaje : "campo obligatorio"
            });
        }else if(!/^[A-záéíóúñÁÉÍÓÚÑ\s]+$/i.test(this.nombre)){
            valido = false;

            this.errorList.push({
                campo : "nombre",
                mensaje : "El nombre no es válido"
            });
        }

        if(this.giro.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "giro",
                mensaje : "campo obligatorio"
            });
        }

        if(this.direccion.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "direccion",
                mensaje : "campo obligatorio"
            });
        }else if(/^\d+$/.test(this.direccion)){
            valido = false;

            this.errorList.push({
                campo : "direccion",
                mensaje : "campo obligatorio"
            });
        }

        if(this.telefono.trim() !== "" && !/^\d+$/i.test(this.telefono)){
            valido = false;

            this.errorList.push({
                campo : "telefono",
                mensaje : "Debe ingresar número de teléfono válido"
            });
        }

        if(this.rut.trim() === ""){
            valido = false;

            this.errorList.push({
                campo : "rut",
                mensaje : "campo obligatorio"
            });
        }else if(!$.Rut.validar(this.rut)){
            valido = false;

            this.errorList.push({
                campo : "rut",
                mensaje : "El rut es incorrecto"
            });
        }

        if(this.situacionComercial === "otro" && !this.cantidad){
            valido = false;

            this.errorList.push({
                campo: "cantidad",
                mensaje: "Debe ingresar cantidad"
            });
        }

        return valido;
    },

    getErrorList: function(){
        return this.errorList;
    },

    getJSON: function(){
        var json = {
            nombre : this.nombre.trim(),
            giro : this.giro.trim(),
            direccion : this.direccion,
            telefono : this.telefono,
            rut : this.rut,
            situacion_comercial : this.situacionComercial,
            credito : this.credito,
            dispensador : this.dispensador,
            id_cliente : this.idCliente,
            es_lipigas : this.es_lipigas,
            obs : this.observacion
        };

        if(this.idCliente){
            json.id_cliente = this.idCliente;
        }

        return json;
    }
};
