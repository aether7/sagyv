var BodegaController = require("./bodega_controller.js");

function GuiaProductoController($http){
    BodegaController.call(this, $http, true);
    this.guia = new App.Models.Factura();
    this.paso = 1;
    this.garantias = null;
    this.valorCalculado = 0;
    this.producto = {};
    this.versionAnterior = null;
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

        if(this.producto.id && parseInt(this.producto.cantidad) > 0){
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
        if(!this.guia.esValida()){
            return;
        }

        this.paso = 2;
        this.garantias = this.sumarGarantias();
        this.versionAnterior = JSON.stringify(this.garantias);
    },

    guardarPaso2: function(){
        //var nuevoHash = JSON.stringify(this.garantias).replace(/\,\"\$\$hashKey\":\d+/g,'');

        var nuevoHash = JSON.stringify(this.garantias.map(function(garantia){
            return { codigo: garantia.codigo, cantidad: garantia.cantidad };
        }));

        console.log('garantias');
        console.log(this.versionAnterior);
        console.log(nuevoHash);
        return;

        if(this.versionAnterior !== nuevoHash){
            this.paso = 3;
            return;
        }

        this.procesarGuardado();
    },

    guardarPaso3: function(){
        this.procesarGuardado();
    },

    procesarGuardado: function(){
        var json,
            action,
            _this = this;

        action = App.urls.get("bodega:guardar_factura");
        this.guia.garantias = this.garantias;
        json = this.guia.getJSON();

        this.http.post(action, json).success(function(data){
            data.guia.productos.forEach(function(producto){
                var cantidad,
                    stock = $("#stock_" + producto.id);

                cantidad = parseInt(stock.text(), 10);
                stock.text(cantidad);
            });

            $("#modal_carga_producto").modal("hide");
            common.agregarMensaje("La guía ha sido guardada exitosamente");
        });
    },

    esPaso: function(numeroPaso){
        return this.paso === numeroPaso;
    }
});

module.exports = GuiaProductoController;
