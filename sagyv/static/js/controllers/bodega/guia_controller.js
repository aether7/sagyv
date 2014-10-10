var Recarga = require('../../models/bodega/recarga_model.js');

function GuiaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.recarga = new Recarga();
    this.productos = [];
    this.producto = {};
    this.fecha = null;
    this.guias = [];

    this.filtrarGuias();
    this.addListeners();
}

GuiaController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarProductos', this.filtrarGuias.bind(this));
    },

    filtrarGuias: function(){
        var fecha = null,
            _this = this;

        if(this.fecha){
            fecha = common.fecha.fechaToJSON(this.fecha);
        }

        this.service.filtrarPorFecha(fecha, function(data){
            _this.guias = data.guias.map(function(guia){
                guia.fecha = common.fecha.jsonToDate(guia.fecha);
                return guia;
            });
        });
    },

    verGuia: function(id){
        var _this = this;

        this.service.obtenerGuia(id, function(data){
            _this.productos = data.productos;
            $('#modal_mostrar_guia').modal('show');
        });
    },

    recargarGuia: function(id){
        this.recarga = new Recarga();
        this.service.obtenerGuia(id, this.procesarMostrarRecarga.bind(this, id));
    },

    procesarMostrarRecarga: function(id, data){
        this.recarga.id = id;
        this.recarga.numero = data.numero_guia;
        this.recarga.vehiculo = data.movil;
        this.recarga.fecha = common.fecha.agregarCeros(data.fecha);
        this.recarga.productos = data.productos;

        $('#modal_recargar_guia').modal('show');
    },

    agregarRecarga: function(idSelect){
        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
            this.producto.codigo = $('#' + idSelect + ' option:selected').text();
        }

        if(this.recarga.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        this.recarga.productos_recarga.splice(indice, 1);
    },

    guardarRecarga: function(){
        if(!this.recarga.esValida()){
            return;
        }

        var json = this.recarga.getJSON();
        this.service.guardarRecarga(json, this.procesarRecarga.bind(this));
    },

    procesarRecarga: function(data){
        data.productos.forEach(function(producto){
            $('#stock_' + producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
        });

        $('#modal_recargar_guia').modal('hide');
        common.agregarMensaje('Se ha actualizado el vehiculo exitosamente');
    }
});

module.exports = GuiaController;
