(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.httpProvider);

function BodegaController($http){
    this.guia = new App.Models.Guia();
    this.factura = new App.Models.Factura();
    this.producto = {};
    this.http = $http;
    this.numeroGuia = null;

    this.refrescarNumeroGuia();
};

BodegaController.prototype = {
    constructor: BodegaController,

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
        this.guia.numero = this.numeroGuia;
        this.producto = {};

        $("#modal_guia_despacho").modal("show");
    },

    nuevaFactura:function(){
        this.factura = new App.Models.Factura();
        this.producto = {}

        $("#modal_carga_producto").modal("show");
    },

    agregarProductoDescuento: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.guia.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }

    },

    agregarProducto: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
            this.producto.precio = $("#" + idSelect + " option:selected").data("precio");
        }

        if(this.factura.agregarProducto(this.producto)){
            this.producto = {};
        }

    },

    eliminarProducto: function(indice){
        this.guia.productos.splice(indice, 1);
    },

    guardarGuiaDespacho: function(){
        var json,
            action,
            valido = this.guia.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:crea_guia");
        json = this.guia.getJSON();

        this.http.post(action, json)
            .success(this.procesarGuardarGuiaDespacho.bind(this));
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
        var _this = this,
            action = App.urls.get("bodega:obtener_id_guia");

        this.http.get(action).success(function(data){
            _this.numeroGuia = data.next;

            setTimeout(function(){
                _this.refrescarNumeroGuia();
            }, 10000);
        });
    }
};

function GuiaController($http){
    this.http = $http;
    this.productos = [];
}

GuiaController.prototype = {
    constructor: GuiaController,

    verGuia: function(id){
        var action = App.urls.get("bodega:obtener_guia"),
            _this = this;

        action += "?guia_id=" + id;

        this.http.get(action).success(function(data){
            _this.productos = data.productos;
            $("#modal_mostrar_guia").modal("show");
        });
    }
};

function TransitoController($http){
    this.resultados = null;
    this.http = $http;
}

TransitoController.prototype = {
    constructor: TransitoController,

    verDetalle: function(id){
        var action = App.urls.get("bodega:obtener_vehiculos_por_producto"),
            _this = this;

        action += "?producto_id=" + id;

        this.http.get(action).success(function(data){
            _this.resultados = data;
            $("#modal_ver_detalle").modal("show");
        });
    }
};

app.controller("BodegaController", ["$http", BodegaController]);
app.controller("GuiaController", ["$http", GuiaController]);
app.controller("TransitoController", ["$http", TransitoController]);

})();
