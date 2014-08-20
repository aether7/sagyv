(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.provider);

function BodegaController($http){
    this.guia = new App.Models.Guia();
    this.producto = {};
    this.http = $http;
    this.idGuia = null;

    this.refrescarIdGuia();
};

BodegaController.prototype = {
    constructor: BodegaController,

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
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
        });
    },

    refrescarIdGuia: function(){
        var _this = this,
            action = App.urls.get("bodega:obtener_id_guia");

        this.http.get(action).success(function(data){
            if(!_this.guia.numero){
                console.log("aqui");
                _this.guia.numero = data.next;
            }

            setTimeout(function(){
                _this.refrescarIdGuia();
            }, 10000);
        });
    }
};

app.controller("BodegaController", ["$http", BodegaController]);

})();
