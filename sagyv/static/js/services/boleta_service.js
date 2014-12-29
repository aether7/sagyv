var serviceUtil = require('./service_util.js');

function boletaService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('guias:obtener_talonarios');
            get(url, callback);
        },

        agregar: function(json, callback){
            var url = App.urls.get('guias:crear_talonario');
            post(url, json, callback);
        },

        editar: function(json, callback){
            var url = App.urls.get('guias:editar_talonario');
            post(url, json, callback);
        },

        eliminar: function(id, callback){
            var url = App.urls.get('guias:eliminar_talonario');
            post(url, { id : id }, callback);
        }
    };

    return services;
}

module.exports = boletaService;
