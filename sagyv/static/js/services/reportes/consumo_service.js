var serviceUtil = require('../service_util.js');

function consumoService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('reportes:obtener_consumo');

            get(url, callback);
        },

        filtrar: function(fechaInicio, fechaTermino, callback){
            var url = App.urls.get('reportes:obtener_consumo');

            get(url,{ fechaInicio : fechaInicio, fechaTermino : fechaTermino }, callback);
        }
    };

    return services;
}

module.exports = consumoService;
