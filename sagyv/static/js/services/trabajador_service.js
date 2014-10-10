var serviceUtil = require('./service_util.js');

function service($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var action = App.urls.get('trabajador:todos');
            get(action, callback);
        },

        crear: function(param, callback){
            var action = App.urls.get('trabajador:crear');
            post(action, param, callback);
        },

        obtener: function(id, callback){
            var action = App.urls.get('trabajador:obtener');
            get(action, { id: id }, callback);
        },

        actualizar: function(params, callback){
            var action = App.urls.get('trabajador:actualizar');
            post(action, params, callback);
        },

        eliminar: function(id, callback){
            var action = App.urls.get('trabajador:eliminar');
            post(action, { id: id }, callback);
        },

        guardarBoleta: function(json, callback){
            var url = App.urls.get('trabajador:guardar_boleta');
            post(url, json, callback);
        },

        buscarBoleta: function(id, callback){
            var url = App.urls.get('trabajador:buscar_boleta');
            get(url, { id: id }, callback);
        }
    };

    return services;
};

module.exports = service;
