var serviceUtil = require('./service_util.js');

function liquidacionService($http){
    return {
        buscarGuia: function(data, callback){
            if(!_.isObject(data)){
                throw new TypeError('el parametro debe ser un JSON');
            }

            var url = App.urls.get('liquidacion:obtener_guia');
            url = serviceUtil.processURL(url, data);
            $http.get(url).success(callback).error(serviceUtil.standardError);
        },

        buscarCliente: function(data, callback){
            if(!_.isObject(data)){
                throw new TypeError('el parametro debe ser un JSON');
            }

            var url = App.urls.get('liquidacion:buscar_cliente');
            url = serviceUtil.processURL(url, data);
            $http.get(url).success(callback).error(serviceUtil.standardError);
        }
    };
}

module.exports = liquidacionService;
