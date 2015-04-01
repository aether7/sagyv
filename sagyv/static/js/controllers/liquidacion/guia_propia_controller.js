var Producto = require('./../../models/liquidacion/producto_model.js'),
    VentaPropia = require('./../../models/liquidacion/venta_propia_model.js'),
    guias = require('./mixins.js').guias;

function GuiaPropiaController($scope, service, calcularRestanteService){
    this.service = service;
    this.scope = $scope;
    this.calcularRestanteService = calcularRestanteService;

    this.totalGuia = 0;
    this.idCliente = null;

    this.venta = null;
    this.descripcionDescuento = '';
    this.cliente = {};
    this.producto = {};
    this.descuento = {};
    this.mensajes = {};
}

GuiaPropiaController.mixin({
    resetearGuia: function(){
        this.idCliente = null;
        this.descripcionDescuento = '';
        this.venta = new VentaPropia();
        this.producto = {};
    },

    buscarCliente: function(){
        this.service.buscarCliente({ id_cliente: this.idCliente }, this.procesarCliente.bind(this));
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
        var obj, producto = null;

        if(!this.esValidoProducto()){
            return;
        }

        obj = JSON.parse(this.producto.tipo);

        producto = new Producto();
        producto.cantidad = this.producto.cantidad;
        producto.precio = obj.precio;
        producto.codigo = obj.codigo;
        producto.descuento = this.descuento;
        producto.calcularTotal();

        this.venta.addProducto(producto);
        this.producto = {};
    },

    esValidoProducto: function(){
        this.mensajes = {};

        if(!this.producto.tipo){
            this.mensajes.producto = 'No se ha seleccionado que producto se desea agregar';
            return false;
        }

        this.scope.productos = this.calcularRestanteService.calculaRestantes(this.scope.productos);
        this.producto.cantidad = this.producto.cantidad.replace(/\D+/g, '');
        var obj = JSON.parse(this.producto.tipo);

        if(!this.producto.cantidad || parseInt(this.producto.cantidad) < 1){
            this.mensajes.producto = 'Se debe ingresar una cantidad de producto';
            return false;
        }else if(!this.calcularRestanteService.tieneStockDisponible(obj.codigo, this.producto.cantidad)){
            this.mensajes.producto = 'No se puede elegir una mayor a la disponible';
            return false;
        }

        return true;
    },

    removeProducto: function(index){
        this.venta.removeProducto(index);
    },

    esValido: guias.esValido,

    guardar: function(){
        if(!this.esValido()){
            return;
        }

        this.scope.productos = this.calcularRestanteService.calculaRestantes(this.scope.productos);
        this.scope.productos = this.calcularRestanteService.restar(this.scope.productos, this.venta.productos);

        this.venta.cliente.id = this.idCliente;
        this.scope.$emit('guia:agregarVenta', this.venta);
        common.agregarMensaje('Se ha guardado guía propia exitosamente');
        $('#modal_guia_propia').modal('hide');
    }
});

module.exports = GuiaPropiaController;
