var serviceUtil = require('./service_util.js');

function liquidacionService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        buscarGuia: function(data, callback){
            var data = { id_guia_despacho: data },
                url = App.urls.get('liquidacion:obtener_guia');

            get(url, data, callback);
        },

        buscarCliente: function(data, callback){
            var url = App.urls.get('liquidacion:buscar_cliente');
            get(url, data, callback);
        }
    };

    return services;
}

module.exports = liquidacionService;
