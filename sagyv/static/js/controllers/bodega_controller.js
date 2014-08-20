(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.httpProvider);

function BodegaController($http){
    this.guia = new App.Models.Guia();
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
        var json,
            action,
            valido = this.guia.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:crea_guia");
        json = this.guia.getJSON();

        this.http.post(action, json).success(function(data){
            console.log(data);
            $("#modal_guia_despacho").modal("hide");
            common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");

            var html,
                tpl = $("#tpl_nueva_guia").html(),
                fx = Handlebars.compile(tpl);

            html = fx({
                numero_guia: _this.guia.numero,
                numero_vehiculo: _this.guia.vehiculo,
                fecha_guia: _this.guia.fecha
            });

            console.log(html);

            $("#tbl_guias tbody").append(html);
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

app.controller("BodegaController", ["$http", BodegaController]);

})();
