var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services, get, post;

    get = function(url, callback){
        $http.get(url).success(callback).error(serviceUtil.standardError);
    };

    post = function(url, params, callback){
        $http.post(url, params).success(callback).error(serviceUtil.standardError);
    };

    services = {
        findProductos: function(callback){
            var url = App.urls.get('bodega:obtener_productos');
            get(url, callback);
        },

        obtenerGuia: function(params, callback){
            var url = App.urls.get('bodega:obtener_guia');
            url = serviceUtil.processURL(url, params);
            get(url, callback);
        },

        filtrarPorFecha: function(params, callback){
            var url = App.urls.get('bodega:filtrar_guias');
            url = serviceUtil.processURL(url, params);

            get(url, callback);
        },

        guardarRecarga: function(params, callback){
            var url = App.urls.get('bodega:recargar_guia');
            post(url, params, callback);
        },

        crearGuia: function(params, callback){
            var url = App.urls.get('bodega:crea_guia');
            post(url, params, callback);
        },

        guardarFactura: function(params, callback){
            var url = App.urls.get('bodega:guardar_factura');
            post(params, callback);
        },

        findNumeroGuia: function(callback){
            var url = App.urls.get('bodega:obtener_id_guia');
            get(url, callback);
        }
    };

    return services;
}

module.exports = BodegaService;
