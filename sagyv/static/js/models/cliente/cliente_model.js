var SituacionComercial = require('./situacion_comercial_model.js');

function Cliente(){
    this.id = null;
    this.nombre = null;
    this.giro = null;
    this.rut = null;
    this.telefono = null;
    this.direccion = null;
    this.situacionComercial = null;
    this.credito = null;
    this.dispensador = null;
    this.propio = null;
    this.lipigas = null;
    this.observacion = null;

    this.situacionComercialObj = null;
    this.mensajes = {};
}

Cliente.prototype = {
    constructor: Cliente,

    setSituacionComercial: function(situacionComercial){
        if(!situacionComercial){
            return;
        }

        this.situacionComercial = new SituacionComercial();
        this.situacionComercial.id = situacionComercial.id;
        this.situacionComercial.monto = situacionComercial.monto;
        this.situacionComercial.producto = situacionComercial.producto;
        this.situacionComercial.tipoDescuento = situacionComercial.tipoDescuento;

        this.situacionComercialObj = situacionComercial;
    },

    setStringSituacion: function(){
        if(!this.situacionComercialObj){
            return;
        }

        var obj;

        if(typeof this.situacionComercialObj === 'string'){
            obj = JSON.parse(this.situacionComercialObj);
        }else{
            obj = this.situacionComercialObj;
        }

        this.situacionComercial = new SituacionComercial();
        this.situacionComercial.id = obj.id;
        this.situacionComercial.monto = obj.monto;
        this.situacionComercial.producto = obj.producto;
        this.situacionComercial.tipoDescuento = obj.tipoDescuento;
    },

    getSituacionComercial: function(){
        if(!this.situacionComercial){
            return 'Sin descuento';
        }else{
            return this.situacionComercial.getTipoDescuento();
        }
    },

    toJSON: function(){
        this.setStringSituacion();

        var json = {
            nombre: this.nombre,
            giro: this.giro,
            rut: this.rut,
            telefono: this.telefono,
            direccion: this.direccion,
            credito: this.credito,
            dispensador: this.dispensador,
            lipigas: this.lipigas,
            propio: this.propio,
            observacion: this.observacion,
            situacionComercialId: this.situacionComercial ? this.situacionComercial.id : null
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this._nombreValido() && valido;
        valido = this._giroValido() && valido;
        valido = this._rutValido() && valido;
        valido = this._direccionValido() && valido;
        valido = this._telefonoValido() && valido;

        return valido;
    },

    _nombreValido: function(){
        if(!this.nombre){
            this.mensajes.nombre = 'campo requerido';
            return false;
        }

        return true;
    },

    _giroValido: function(){
        if(!this.giro){
            this.mensajes.giro = 'campo requerido';
            return false;
        }

        return true;
    },

    _rutValido: function(){
        if(!this.rut){
            this.mensajes.rut = 'campo requerido';
            return false;
        }else if(!$.Rut.validar(this.rut)){
            this.mensajes.rut = 'RUT inválido';
            return false;
        }

        return true;
    },

    _telefonoValido: function(){
        if(!this.telefono){
            this.mensajes.telefono = 'campo requerido';
            return false;
        }else if(isNaN(this.telefono)){
            this.mensajes.telefono = 'teléfono inválido';
            return false;
        }

        return true;
    },

    _direccionValido: function(){
        if(!this.direccion){
            this.mensajes.direccion = 'campo requerido';
            return false;
        }

        return true;
    }
};

module.exports = Cliente;
