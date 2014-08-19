(function(){
"use strict";

var app = angular.module("bodegaApp", []);

function BodegaController(){
    this.guia = null;
    this.producto = {};
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
        var valido = this.guia.esValida();
        console.log(this.guia);

        if(!valido){
            return;
        }
    }
};

app.controller("BodegaController", BodegaController);

})();
