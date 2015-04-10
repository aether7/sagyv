function Factura(){
    this.id = null;
    this.factura = null;
    this.valor = null;
    this.fecha = new Date();
    this.productos = [];
    this.garantias = null;

    this.mensajes = {};
};

Factura.prototype = {
    constructor: Factura,

    esValida: function(){
        var valido = true;

        valido = this.esFacturaValida() && valido;
        valido = this.esValorValido() && valido;
        valido = this.esFechaValida() && valido;
        valido = this.esProductoValid() && valido;

        return valido;
    },

    agregarProducto: function(producto){
        var fn,
            valido = true;

        fn = function(p){
            return p.codigo === producto.codigo && p.id === producto.id && p.precio === producto.precio;
        };

        this.mensajes.producto = "";

        if(!producto.id || !producto.codigo || !producto.cantidad){
            valido = false;
            this.mensajes.producto = "El producto debe ingresarse tanto el código como la cantidad";
        }else if(_.find(this.productos, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
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

    esFacturaValida: function(){
        return this._esNumeroValido('factura');
    },

    esValorValido: function(){
        return this._esNumeroValido('valor');
    },

    esFechaValida: function(){
        return this._esFechaValida('fecha');
    },

    esProductoValid: function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    getJSON: function(){
        var json = {
            factura: this.factura,
            valor: this.valor,
            fecha: common.fecha.fechaToJSON(this.fecha),
            productos: JSON.stringify(this.productos),
            garantias: JSON.stringify(this.garantias),
            observaciones: this.observaciones
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = Factura;
