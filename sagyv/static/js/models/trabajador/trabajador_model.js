var Trabajador = function(){
    this.id = null;
    this.nombre = null;
    this.apellido = null;
    this.rut = null;
    this.domicilio = null;
    this.fechaNacimiento = null;
    this.inicioContrato = null;
    this.vigenciaLicencia = null;
    this.tipo = 1;
    this.afp = null;
    this.sistemaSalud = null;
    this.estadoCivil = null;
    this.estadoVacacion = null;

    this.boleta = {};
    this.mensajes = {};
};

Trabajador.prototype = {
    constructor: App.Models.Trabajador,

    esNombreValido: function(){
        return this._esTextoValido("nombre", "El nombre no es válido");
    },

    esApellidoValido: function(){
        return this._esTextoValido("apellido", "El apellido no es válido");
    },

    esRutValido: function(){
        var valido = true;

        this.mensajes.rut = "";

        if(!this.rut){
            valido = false;
            this.mensajes.rut = "campo obligatorio";
        }else if(!$.Rut.validar(this.rut)){
            valido = false;
            this.mensajes.rut = "RUT no válido";
        }

        return valido;
    },

    esDomicilioValido: function(){
        var valido = true;

        this.mensajes.domicilio = "";

        if(!this.domicilio){
            valido = false;
            this.mensajes.domicilio = "campo obligatorio";
        }

        return valido;
    },

    esFechaNacimientoValida: function(){
        return this._esFechaValida("fechaNacimiento");
    },

    esInicioContratoValido: function(){
        return this._esFechaValida("inicioContrato");
    },

    esVigenciaLicenciaValida: function(){
        return this._esFechaValida("vigenciaLicencia");
    },

    esAfpValida: function(){
        return this._esSeleccionValida("afp");
    },

    esSistemaSaludValido: function(){
        return this._esSeleccionValida("sistemaSalud");
    },

    esEstadoCivilValido: function(){
        return this._esSeleccionValida("estadoCivil");
    },

    esEstadoVacacionValido: function(){
        return this._esSeleccionValida("estadoVacacion");
    },

    esTipoValido: function(){
        return this._esSeleccionValida("tipo");
    },

    esValido: function(){
        var valido = true;

        valido = this.esNombreValido() && valido;
        valido = this.esApellidoValido() && valido;
        valido = this.esRutValido() && valido;
        valido = this.esDomicilioValido() && valido;
        valido = this.esFechaNacimientoValida() && valido;
        valido = this.esInicioContratoValido() && valido;
        valido = this.esVigenciaLicenciaValida() && valido;
        valido = this.esEstadoVacacionValido() && valido;
        valido = this.esEstadoCivilValido() && valido;
        valido = this.esTipoValido() && valido;

        if(this.tipo == 2){
            return valido;
        }

        valido = this.esAfpValida() && valido;
        valido = this.esSistemaSaludValido() && valido;

        return valido;
    },

    getJSON: function(){
        var rut = this.rut, json;

        rut = rut.replace(/\./g, '');

        json = {
            nombre: this.nombre,
            apellido: this.apellido,
            rut: rut,
            domicilio: this.domicilio,
            fechaNacimiento: common.fecha.fechaToJSON(this.fechaNacimiento),
            inicioContrato: common.fecha.fechaToJSON(this.inicioContrato),
            vigenciaLicencia: common.fecha.fechaToJSON(this.vigenciaLicencia),
            afp: this.afp,
            sistemaSalud: this.sistemaSalud,
            estadoCivil: this.estadoCivil,
            estadoVacacion: this.estadoVacacion,
            tipoTrabajador: this.tipo
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
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

    _esTextoValido: function(campo, customMje){
        var valido = true,
            regex = /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/i;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!regex.test(this[campo])){
            valido = false;
            this.mensajes[campo] = customMje;
        }

        return valido;
    },

    _esSeleccionValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }

        return valido;
    }
};

module.exports = Trabajador;
