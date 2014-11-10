var serviceUtil = require('./service_util.js');

function terminalService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var url = App.urls.get('guias:obtener_terminales');
            get(url, callback);
        },

        create: function(terminal, callback){
            var url = App.urls.get('guias:crear_terminal');
            post(url, terminal, callback);
        },

        edit: function(terminal, callback){
            post(url, terminal, callback);
        },

        remove: function(id, callback){
            var url = App.urls.get('guias:remover_terminal')
            post(url, { id : id }, callback);
        },

        asignar: function(){

        }
    };

    return services;
}

module.exports = terminalService;
