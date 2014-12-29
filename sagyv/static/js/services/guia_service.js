var serviceUtil = require('./service_util.js');

function guiaService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            callback([
                { inicial: 1, ultima: 2, actual: 1, trabajador: {id:1,nombre:"Alberto"} }
            ]);
        },

        agregar: function(json, callback){
            callback({ id: 3 });
            console.warn('WIP');
        },

        editar: function(json, callback){
            callback();
            console.warn('WIP');
        },

        eliminar: function(id, callback){
            callback();
            console.warn('WIP');
        },

        detalleTalonario: function(id, callback){
            callback();
            console.warn('WIP');
        }
    };

    return services;
}

module.exports = guiaService;
