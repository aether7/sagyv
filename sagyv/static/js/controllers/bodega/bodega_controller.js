function BodegaController($http, service, stop){
    this.service = service;
    this.guia = new App.Models.Guia();
    this.productosBodega = [];

    this.producto = {};
    this.http = $http;
    this.numeroGuia = null;

    if(!stop){
        this.refrescarNumeroGuia();
    }

    this.addListeners();
    this.obtenerProductos();
};

BodegaController.mixin({
    addListeners: function(){

    },

    obtenerProductos: function(){
        var _this = this;

        this.service.findProductos(function(productos){
            _this.productosBodega = productos;
        });
    },

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
        this.guia.numero = this.numeroGuia;
        this.producto = {};

        $("#modal_guia_despacho").modal("show");
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
        var html,
            tpl = $("#tpl_nueva_guia").html(),
            fx = Handlebars.compile(tpl);

        html = fx({
            numero_guia: this.guia.numero,
            numero_vehiculo: this.guia.vehiculo,
            fecha_guia: this.guia.fecha
        });

        this.actualizarProductos(data);

        $("#tbl_guias tbody").append(html);
        $("#modal_guia_despacho").modal("hide");

        common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
    },

    actualizarProductos: function(data){
        data.guia.productos.forEach(function(producto){
            $("#stock_" + producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
        });
    },

    refrescarNumeroGuia: function(){
        var _this = this;

        this.service.findNumeroGuia(function(data){
            _this.numeroGuia = data.next;

            setTimeout(function(){
                _this.refrescarNumeroGuia();
            }, 60000);
        });
    }
});

module.exports = BodegaController;
