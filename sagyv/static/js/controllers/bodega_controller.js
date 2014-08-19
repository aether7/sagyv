(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.provider);

function BodegaController($http){
    this.guia = null;
    this.producto = {};
    this.http = $http;
};

BodegaController.prototype = {
    constructor: BodegaController,

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
        this.guia.fecha = new Date();

        common.mostrarModal("guia_despacho");
    },

    agregarProducto: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.guia.agregarProducto(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        console.log(indice);
        this.guia.productos.splice(indice, 1);
    },

    guardarGuiaDespacho: function(){
        var json,
            action,
            valido = this.guia.esValida();

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:crea_guia");
        json = this.guia.getJSON();
        console.log(json);

        this.http.post(action, json).success(function(data){
            console.log(data);
            common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
        });
    }
};

app.controller("BodegaController", ["$http", BodegaController]);

})();
