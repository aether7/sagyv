App.Models.Recarga = function(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.fecha = new Date().toLocaleString();
    this.productos = [];
    this.productos_recarga = [];
    this.monto = null;
    this.observaciones = null;

    this.mensajes = {};
};

App.Models.Recarga.prototype = {
    construtor: App.Models.Recarga,

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
        }else if(_.find(this.productos_recarga, fn)){
            valido = false;
            this.mensajes.producto = "El producto que intenta ingresar ya se encuentra en la lista";
        }else if(parseInt(App.productos[producto.id]) < parseInt(producto.cantidad)){
            valido = false;
            this.mensajes.producto = "No se pueden agregar mas productos de los que hay en stock";
        }else{
            this.productos_recarga.push(producto);
        }
        return valido;
    },

    esMontoValido: function(){
        var valido = true;

        if(this.monto){
            this.mensajes.monto = '';
            if(isNaN(this.monto)){
                valido = false;
                this.mensajes.monto = "el valor debe ser numérico";
            }else if(parseInt(this.monto) < 0){
                valido = false;
                this.mensajes.monto = "el valor debe ser positivo";
            }
        }else{
            this.monto = 0;
        }

        return valido;
    },


    esProductosValido:function(){
        var valido = true;

        this.mensajes.productos = "";

        if(this.productos_recarga.length < 1){
            valido = false;
            this.mensajes.producto = "Al menos debe haber un producto ingresado";
        }

        return valido;
    },

    esValida: function(){
        var valido = true;
        valido = this.esProductosValido() && valido;
        valido = this.esMontoValido() && valido;

        return valido;
    },

    getJSON: function(){
        var json = {
            id_guia: this.id,
            monto: this.monto,
            productos: JSON.stringify(this.productos_recarga)
        }

        return json;
    }
};
