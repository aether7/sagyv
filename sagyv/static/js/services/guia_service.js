var serviceUtil = require('./service_util.js');

function guiaService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('guias:obtener_guias');
            get(url, callback);
        },

        agregar: function(json, callback){
            var url = App.urls.get('guias:crear_guias');
            post(url, json, callback);
        },

        editar: function(json, callback){
            var url = App.urls.get('guias:editar_guia');
            post(url, json, callback);
        },

        eliminar: function(id, callback){
            var url = App.urls.get('guias:eliminar_guias');
            post(url, { id : id }, callback);
        },

        detalleTalonario: function(id, callback){
            callback();
            console.warn('WIP');
        }
    };

    return services;
}

module.exports = guiaService;
