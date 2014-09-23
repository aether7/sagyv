var Producto = require("./../../models/producto_model.js");

function GuiaPropiaController($http, $scope){
    this.idCliente = null;
    this.descripcionDescuento = "nada";
    this.http = $http;
    this.scope = $scope;
    this.cliente = {};
    this.productoSeleccionado = {};
    this.productosSeleccionados = [];

    this.descuento = {};
    this.mensajes = {};
}

GuiaPropiaController.mixin({
    resetearCliente: function(){
        this.idCliente = null;
        this.descripcionDescuento = "nada";
    },

    buscarCliente: function(){
        var url = App.urls.get("liquidacion:buscar_cliente");
        url += "?id_cliente=" + this.idCliente;

        this.http.get(url).success(this.procesarCliente.bind(this));
    },

    procesarCliente: function(data){
        this.cliente.id = data.id;
        this.cliente.direccion = data.direccion;
        this.cliente.rut = data.rut;
        this.situacionComercial = data.situacion_comercial;
        this.descripcionDescuento = data.situacion_comercial.descripcion_descuento;

        this.descuento.codigo = data.situacion_comercial.codigo;
        this.descuento.credito = data.situacion_comercial.con_credito;
        this.descuento.simbolo = data.situacion_comercial.simbolo;
        this.descuento.cantidad = data.situacion_comercial.monto;
    },

    agregarProducto: function(){
        var obj,
            producto = null;

        if(!this.esValidoProducto()){
            return;
        }

        obj = JSON.parse(this.productoSeleccionado.tipo);

        producto = new Producto();
        producto.cantidad = this.productoSeleccionado.cantidad;
        producto.precio = obj.precio;
        producto.codigo = obj.codigo;
        producto.descuento = this.descuento;
        producto.calcularTotal();

        this.productosSeleccionados.push(producto);
        this.productoSeleccionado = {};
    },

    esValidoProducto: function(){
        this.mensajes = {};

        if(!this.productoSeleccionado.tipo){
            this.mensajes.producto = "No se ha seleccionado que producto se desea agregar";
            return false;
        }

        obj = JSON.parse(this.productoSeleccionado.tipo);

        if(!this.productoSeleccionado.cantidad || parseInt(this.productoSeleccionado.cantidad) < 1){
            this.mensajes.producto = "Se debe ingresar una cantidad de producto";
            return false;
        }else if(obj.cantidad < parseInt(this.productoSeleccionado.cantidad)){
            this.mensajes.producto = "No se puede elegir una mayor a la disponible";
            return false;
        }

        return true;
    },

    eliminarProducto: function(index){
        this.productosSeleccionados.splice(index, 1);
    }
});

module.exports = GuiaPropiaController;
