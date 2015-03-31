var serviceUtil = require('../service_util.js');

function kilosVendidosService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('reportes:obtener_kilos_vendidos');
            get(url, callback);
        },

        filtrar: function(){

        }
    };

    return services;
}

module.exports = kilosVendidosService;
