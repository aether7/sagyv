var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services = {
        obtenerGuia: function(params, callback){
            var url = App.urls.get('bodega:obtener_guia');
            url = serviceUtil.processURL(url, params);

            $http.get(url).success(callback).error(serviceUtil.standardError);
        },

        filtrarPorFecha: function(params, callback){
            var url = App.urls.get('bodega:filtrar_guias');
            url = serviceUtil.processURL(url, params);

            $http.get(url).success(callback).error(serviceUtil.standardError);
        },

        guardarRecarga: function(params, callback){
            var url = App.urls.get('bodega:recargar_guia');
            $http.post(url, params).success(callback).error(serviceUtil.standardError);
        }
    };

    return services;
}

module.exports = BodegaService;
