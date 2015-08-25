function Guia(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.kilometraje = null;
    this.fecha = new Date();
    this.productos = []; //siempre debe comenzar con una nueva lista de productos
    this.observaciones = null;
    this.estado = null;

    this.mensajes = {};
};

Guia.prototype = {
    constructor: Guia,

    agregarProductoDescuento: function(producto){
        var fn,
            valido = true;

        fn = function(p){
            return p.codigo === producto.codigo && p.id === producto.id;
        };

        this.mensajes.producto = "";

        if(!producto.id || !producto.codigo || !producto.cantidad){
            valido = false;
            this.mensajes.producto = "El producto debe ingresarse tanto el código como la cantidad";
        }else if(_.find(this.productos, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
        }else if(parseInt(App.productos[producto.id]) < parseInt(producto.cantidad)){
            valido = false;
            this.mensajes.producto = "No se pueden agregar mas productos de los que hay en stock";
        }else{
            this.productos.push(producto);
        }

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
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

    esVehiculoValido:function(){
        return this._esNumeroValido('vehiculo');
    },

    esFechaValida:function(){
        return this._esFechaValida('fecha');
    },

    esProductosValido:function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    esKilometajeValido: function(){
        return this._esNumeroValido('kilometraje')
    },

    esValida: function(){
        var valido = true;

        valido = this.esNumeroValido() && valido;
        valido = this.esVehiculoValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductosValido() && valido;
        valido = this.esKilometajeValido() && valido;

        return valido;
    },

    getJSON: function(){
        var json = {
            numero: this.numero,
            factura: this.factura,
            vehiculo: this.vehiculo,
            fecha: common.fecha.fechaToJSON(this.fecha),
            productos: JSON.stringify(this.productos),
            kilometraje: this.kilometraje,
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = Guia;
