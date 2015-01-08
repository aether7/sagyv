function service($http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var services = {
        all: function(callback){
            var url = App.urls.get('clientes:obtener_situacion_comercial');
            $http.get(url).success(callback);
        },

        find: function(id, callback){
            var url = App.urls.get('clientes:obtener_situacion_comercial') + '?id=' + id;
            $http.get(url).success(callback);
        },

        create: function(data, callback){
            data = $.param(data);

            var url = App.urls.get('clientes:crear_situacion_comercial');
            $http.post(url, data).success(callback);
        },

        update: function(data, callback){
            data = $.param(data);

            var url = App.urls.get('clientes:modificar_situacion_comercial');
            $http.post(url, data).success(callback);
        }
    };

    return services;
};

module.exports = service;
