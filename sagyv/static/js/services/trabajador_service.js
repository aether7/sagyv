var serviceUtil = require('./service_util.js');

function service($http){
    var error, services;

    error = function(){
        alert('Ha ocurrido un error en el servicor');
    };

    services = {
        findAll: function(callback){
            var action = App.urls.get('trabajador:todos');
            $http.get(action).success(callback).error(serviceUtil.standardError);
        },

        crear: function(param, callback){
            var action = App.urls.get('trabajador:crear');
            $http.post(action, param).success(callback).error(serviceUtil.standardError);
        },

        obtener: function(id, callback){
            var action = App.urls.get('trabajador:obtener') + '?id=' + id;
            $http.get(action).success(callback).error(serviceUtil.standardError);
        },

        actualizar: function(params, callback){
            var action = App.urls.get('trabajador:actualizar');
            $http.post(action, params).success(callback).error(serviceUtil.standardError);
        },

        eliminar: function(id, callback){
            var action = App.urls.get('trabajador:eliminar'),
                json = { id : id };

            $http.post(action, json, callback).error(serviceUtil.standardError);
        },

        guardarBoleta: function(json, callback){
            var url = App.urls.get('trabajador:guardar_boleta');
            $http.post(url, json).success(callback).error(serviceUtil.standardError);
        },

        buscarBoleta: function(id, callback){
            var url = App.urls.get('trabajador:buscar_boleta');
            url += '?id=' + id;

            $http.get(url).success(callback).error(serviceUtil.standardError);
        }
    };

    return services;
};

module.exports = service;
