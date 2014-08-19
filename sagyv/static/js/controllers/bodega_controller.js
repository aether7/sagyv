(function(){
"use strict";

var app = angular.module("bodegaApp", []);

function BodegaController(){
    this.guia = null;
};

BodegaController.prototype = {
    constructor: BodegaController,

    nuevaGuiaDespacho: function(){
        this.guia = new App.Models.Guia();
        this.guia.fecha = new Date();

        common.mostrarModal("guia_despacho");
    },

    guardarGuiaDespacho: function(){
        console.log("ASDFASDFASDF");
        console.log(this.guia);
    }
};

app.controller("BodegaController", BodegaController);

})();
