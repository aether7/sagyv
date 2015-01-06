var guias = {
    esValido: function(){
        var valido = true;
        this.mensajes = {};

        if(!this.idCliente){
            valido = false;
            this.mensajes.cliente = 'campo obligatorio';
        }

        if(!this.venta.numero){
            valido = false;
            this.mensajes.numeroVenta = 'campo obligatorio';
        }

        if(!this.venta.productos.length){
            valido = false;
            this.mensajes.producto = 'al menos se debe ingresar 1 producto';
        }

        return valido;
    }
};

module.exports.guias = guias;
