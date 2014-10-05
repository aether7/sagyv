var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services, get, post, noop;

    noop = function(){};

    get = function(url, callback){
        $http.get(url).success(callback || noop).error(serviceUtil.standardError);
    };

    post = function(url, params, callback){
        $http.post(url, params).success(callback || noop).error(serviceUtil.standardError);
    };

    services = {
        findProductos: function(callback){
            var url = App.urls.get('bodega:obtener_productos');
            get(url, callback);
        },

        findProductosTransito:function(callback){
            var url = App.urls.get('bodega:obtener_productos_transito');
            get(url, callback);
        },

        findConsolidados: function(callback){
            var url = App.urls.get('bodega:obtener_consolidados');
            get(url, callback);
        },

        findVehiculos: function(callback){
            var url = App.urls.get('bodega:obtener_vehiculos_seleccionables');
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
            post(url, params, callback);
        },

        findNumeroGuia: function(callback){
            var url = App.urls.get('bodega:obtener_id_guia');
            get(url, callback);
        },

        findVehiculoByProducto: function(id, callback){
            var url = App.urls.get('bodega:obtener_vehiculos_por_producto');
            url += '?producto_id=' + id;

            get(url, callback);
        }
    };

    return services;
}

module.exports = BodegaService;
