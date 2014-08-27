function GuiaController($http){
    this.recarga = new App.Models.Recarga();
    this.http = $http;
    this.productos = [];
    this.producto = {};
}

GuiaController.prototype = {
    constructor: GuiaController,

    verGuia: function(id){
        var action = App.urls.get("bodega:obtener_guia"),
            _this = this;

        action += "?guia_id=" + id;

        this.http.get(action).success(function(data){
            _this.productos = data.productos;
            $("#modal_mostrar_guia").modal("show");
        });
    },

    recargarGuia: function(id){
        var action = App.urls.get("bodega:obtener_guia"),
            _this =this;

        this.recarga = new App.Models.Recarga();
        action += "?guia_id=" + id;

        this.http.get(action).success(function(data){
            _this.recarga.id = id;
            _this.recarga.numero = data.numero_guia;
            _this.recarga.vehiculo = data.movil;
            _this.recarga.fecha = common.fecha.agregarCeros(data.fecha);
            _this.recarga.productos = data.productos;

            $("#modal_recargar_guia").modal("show");
        });
    },

    agregarRecarga: function(idSelect){
        if(this.producto.id && this.producto.cantidad){
            console.log('take');
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        if(this.recarga.agregarProductoDescuento(this.producto)){
            this.producto = {};
        }
    },

    eliminarProducto: function(indice){
        console.log(this.recarga);
        this.recarga.productos_recarga.splice(indice, 1);
        console.log(this.recarga);
    },

    guardarRecarga: function(){
        var json,
            action,
            valido = this.recarga.esValida(),
            _this = this;

        if(!valido)
            return;

        action = App.urls.get("bodega:recargar_guia");
        json = this.recarga.getJSON();
        this.http.post(action, json);
        //actualizar datos anexos.
    }
};

module.exports = GuiaController;
