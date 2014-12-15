var serviceUtil = require('./service_util.js');

function vehiculoService($http){
    var get, post, service;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    service = {
        findAll: function(callback){
            var url = App.urls.get('vehiculos:obtener_vehiculos');
            get(url, callback);
        },

        crearVehiculo: function(data, callback){
            var url = App.urls.get('vehiculos:nuevo');
            post(url, data, callback);
        }
    };

    return service;
}

module.exports = vehiculoService;
