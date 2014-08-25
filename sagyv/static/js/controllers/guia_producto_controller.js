var BodegaController = require("./bodega_controller.js");

function GuiaProductoController($http){
    BodegaController.call(this, $http, true);
    this.guia = new App.Models.Factura();
    this.paso = 1;
    this.garantias = null;
    this.valorCalculado = 0;
    this.producto = {};
}

GuiaProductoController.mixin(BodegaController,{
    nuevaFactura: function(){
        this.guia = new App.Models.Factura();
        this.producto = {}
        this.paso = 1;
        this.valorCalculado = 0;

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
            this.valorCalculado += this.producto.precio;
            this.producto = {};
        }
    },

    eliminarProducto: function(index){
        var producto = this.guia.productos[index];
        this.valorCalculado -= producto.precio;
        this.guia.productos.splice(index, 1);
    },

    sumarGarantias: function(){
        var garantias,
            porRegistrar = [];

        garantias = { "3105": 0, "3111": 0, "3115": 0, "3145": 0 };

        this.guia.productos.forEach(function(producto){
            var codigo = producto.codigo.split("").slice(2).join("");

            if("31" + codigo in garantias){
                garantias["31" + codigo] += parseInt(producto.cantidad);
            }
        });

        Object.keys(garantias).forEach(function(key){
            if(garantias[key]){
                porRegistrar.push({
                    codigo: key,
                    cantidad: garantias[key]
                });
            }
        });

        return porRegistrar;
    },

    guardarPaso1: function(){
        this.paso = 2;
        this.procesarPaso1();

        return;

        var json,
            action,
            valido = this.guia.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:guardar_factura");
        json = this.guia.getJSON();

        this.http.post(action, json)
            .success(this.procesarPaso1.bind(this));
    },

    procesarPaso1: function(data){
        this.paso = 2;
        this.garantias = this.sumarGarantias();
    },

    guardarPaso2: function(){
        this.paso = 3;
    },

    guardarPaso3: function(){
        alert("FELICIDADES COMPLETASTE EL PUTO LVL");
    },

    esPaso: function(numeroPaso){
        return this.paso === numeroPaso;
    }
});

module.exports = GuiaProductoController;
