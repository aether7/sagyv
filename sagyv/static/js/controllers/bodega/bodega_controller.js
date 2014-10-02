var Guia = require('../../models/bodega/guia_model.js');

function BodegaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.guia = new Guia();
    this.productosBodega = [];

    this.producto = {};
    this.numeroGuia = null;
    this.addListeners();
    this.obtenerProductos();
};

BodegaController.mixin({
    addListeners: function(){
        this.scope.$on('bodega/recargaProductos', this.obtenerProductos.bind(this));
    },

    obtenerProductos: function(){
        var _this = this;

        console.log('estoy recargando los productos desde DJANGO');

        this.service.findProductos(function(productos){
            _this.productosBodega = productos;
        });
    },

    nuevaGuiaDespacho: function(){
        this.guia = new Guia();
        this.guia.numero = this.numeroGuia;
        this.producto = {};

        this.refrescarNumeroGuia(function(){
            $('#modal_guia_despacho').modal('show');
        });
    },

    agregarProductoDescuento: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.guia.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        this.guia.productos.splice(indice, 1);
    },

    guardarGuiaDespacho: function(){
        var json, valido = this.guia.esValida();

        if(!valido){
            return;
        }

        json = this.guia.getJSON();
        this.service.crearGuia(json, this.procesarGuardarGuiaDespacho.bind(this));
    },

    guardarFactura: function(){
        var json, valido = this.factura.esValida();

        if(!valido){
            return;
        }

        json = this.factura.getJSON();
        this.service.guardarFactura(json, function(data){
            alert('no está implementado');
        });
    },

    procesarGuardarGuiaDespacho: function(data){
        this.obtenerProductos();
        $('#modal_guia_despacho').modal('hide');
        common.agregarMensaje('Se ha actualizado el vehiculo exitosamente');
    },

    refrescarNumeroGuia: function(callback){
        var _this = this;

        this.service.findNumeroGuia(function(data){
            _this.numeroGuia = data.next;

            if(typeof callback === 'function'){
                callback();
            }
        });
    }
});

module.exports = BodegaController;
