function TransitoController($http){
    this.resultados = null;
    this.http = $http;
}

TransitoController.prototype = {
    constructor: TransitoController,

    verDetalle: function(id){
        var action = App.urls.get("bodega:obtener_vehiculos_por_producto"),
            _this = this;

        action += "?producto_id=" + id;

        this.http.get(action).success(function(data){
            _this.resultados = data;
            $("#modal_ver_detalle").modal("show");
        });
    }
};

module.exports = TransitoController;
