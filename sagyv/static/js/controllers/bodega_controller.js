function BodegaController($http, stop){
    this.guia = new App.Models.Guia();
    this.producto = {};
    this.http = $http;
    this.numeroGuia = null;

    if(!stop){
        this.refrescarNumeroGuia();
    }
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

        this.http.post(action, json)
            .success(this.procesarGuardarGuiaDespacho.bind(this));
    },

    guardarFactura: function(){
        var json,
            action,
            valido = this.factura.esValida(),
            _this = this;

        if(!valido){
            return;
        }

        action = App.urls.get("bodega:guardar_factura");
        json = this.factura.getJSON();
        console.log(json);

        this.http.post(action, json);
            //.success(this.procesarGuardarGuiaDespacho.bind(this));
    },

    procesarGuardarGuiaDespacho: function(data){
        var html,
            tpl = $("#tpl_nueva_guia").html(),
            fx = Handlebars.compile(tpl);

        html = fx({
            numero_guia: this.guia.numero,
            numero_vehiculo: this.guia.vehiculo,
            fecha_guia: this.guia.fecha
        });

        this.actualizarProductos(data);

        $("#tbl_guias tbody").append(html);
        $("#modal_guia_despacho").modal("hide");

        common.agregarMensaje("Se ha actualizado el vehiculo exitosamente");
    },

    actualizarProductos: function(data){
        data.guia.productos.forEach(function(producto){
            $("#stock_" + producto.id).text(producto.cantidad);
            App.productos[producto.id] = producto.cantidad;
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

module.exports = BodegaController;
