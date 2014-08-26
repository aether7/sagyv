function GuiaController($http){
    this.recarga = new App.Models.Recarga();
    this.http = $http;
    this.productos = [];
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
            _this.recarga.fecha = data.fecha;
            _this.recarga.productos = data.productos;

            common.mostrarModal('recargar_guia');
        });
    },
};

module.exports = GuiaController;
