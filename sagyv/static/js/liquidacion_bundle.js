(function(){
"use strict";

var app = angular.module("liquidacionApp",[]),
    LiquidacionController = require("./controllers/liquidacion/liquidacion_controller.js"),
    ProductoController = require("./controllers/liquidacion/producto_controller.js"),
    GuiaPropiaController = require("./controllers/liquidacion/guia_propia_controller.js");

app.controller("LiquidacionController", ["$http","$scope", LiquidacionController]);
app.controller("ProductoController", ["$scope", ProductoController]);
app.controller("GuiaPropiaController", ["$http", "$scope", GuiaPropiaController]);

})();

$("button[data-accion=abre_modal]").on("click", function(evt){
    $("#modal_" + $(this).data("modal")).modal("show");
});
