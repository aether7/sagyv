function SituacionComercial(){
    this.id = null;
    this.monto = null;
    this.tipoDescuento = { id: null, tipo: null };
    this.producto = { id: null, codigo: null, nombre: null };

    this.mensajes = {};
}

SituacionComercial.prototype = {
    constructor: SituacionComercial,

    getTipoDescuento: function(){
        var str = '';

        if(this.tipoDescuento.id === 1){
            str += '$ ' + this.monto + ' en (' + this.producto.codigo + ')';
        }else if(this.tipoDescuento.id === 2){
            str += this.monto + ' % en (' + this.producto.codigo + ')';
        }

        return str;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this._montoValido() && valido;
        valido = this._tipoDescuentoValido() && valido;
        valido = this._productoValido() && valido;

        return valido;
    },

    _montoValido: function(){
        if(!this.monto){
            this.mensajes.monto = 'Campo obligatorio';
            return false;
        }else if(isNaN(this.monto)){
            this.mensajes.monto = 'Número inválido';
            return false;
        }else if(parseInt(this.monto) < 1){
            this.mensajes.monto = 'El monto a ingresar debe ser al menos 1';
            return false;
        }

        return true;
    },

    _tipoDescuentoValido: function(){
        if(!this.tipoDescuento.id){
            this.mensajes.tipoDescuento = 'Debe seleccionar un tipo de descuento';
            return false;
        }

        return true;
    },

    _productoValido: function(){
        if(!this.producto.id){
            this.mensajes.producto = 'Debe elegir un formato de descuento';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            monto: this.monto,
            tipoDescuento: JSON.stringify(this.tipoDescuento),
            producto: JSON.stringify(this.producto)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    equals: function(sc){
        var eq = true;

        if(!(sc instanceof SituacionComercial)){
            eq = false;
        }else if(parseInt(sc.monto) !== parseInt(this.monto)){
            eq = false;
        }else if(parseInt(sc.tipoDescuento.id) !== parseInt(this.tipoDescuento.id)){
            eq = false;
        }else if(parseInt(sc.producto.id) !== parseInt(this.producto.id)){
            eq = false;
        }

        return eq;
    }
};

module.exports = SituacionComercial;
