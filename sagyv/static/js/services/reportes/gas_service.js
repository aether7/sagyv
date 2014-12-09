var serviceUtil = require('../service_util.js');

function gasService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('reportes:obtener_gas');
            get(url, callback);
        },

        filtrar: function(){

        }
    };

    return services;
}

module.exports = gasService;
