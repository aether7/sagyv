var BodegaController = require("./bodega_controller.js"),
    proto;

function GuiaProductoController($http){
    BodegaController.call(this, $http, true);
    this.guia = new App.Models.Factura();
}

GuiaProductoController.mixin(BodegaController,{
    nuevaFactura: function(){
        this.guia = new App.Models.Factura();
        this.producto = {}

        $("#modal_carga_producto").modal("show");
    },

    agregarProducto: function(idSelect){
        var select;

        if(this.producto.id && this.producto.cantidad){
            select = $("#" + idSelect + " option:selected");
            this.producto.codigo = select.text();
            this.producto.precio = select.data("precio") * this.producto.cantidad;
        }

        if(this.guia.agregarProducto(this.producto)){
            this.producto = {};
        }
    },

    guardarFactura: function(){
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
    }
});

module.exports = GuiaProductoController;
