(function(){
"use strict";

var app = angular.module("bodegaApp", [], App.provider);

function BodegaController($http, $scope){
    this.guia = new App.Models.Guia();
    this.producto = {};
    this.http = $http;
    this.scope = $scope;
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
            $("#modal_guia_despacho").modal("hide");
            common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
        });
    }
};

app.controller("BodegaController", ["$http", "$scope", BodegaController]);

})();
