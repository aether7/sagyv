function service($http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var services = {
        all: function(callback){
            var url = App.urls.get('clientes:obtener');
            $http.get(url).success(callback);
        },

        searchBy: function(value, type, callback){
            var url = App.urls.get('clientes:buscar_cliente');
            url += '?busqueda=' + value + '&opcion=' + type;
            $http.get(url).success(callback);
        },

        find: function(id, callback){
            var url = App.urls.get('clientes:obtener') + '?id=' + id;
            $http.get(url).success(callback);
        },

        create: function(data, callback){
            var url = App.urls.get('clientes:crear');
            data = $.param(data);
            $http.post(url, data).success(callback);
        },

        update: function(data, callback){
            var url = App.urls.get('clientes:update');
            data = $.param(data);
            $http.post(url, data).success(callback);
        },

        remove: function(id, callback){
            var url = App.urls.get('clientes:eliminar'),
                data = $.param({ id : id });

            $http.post(url, data).success(callback);
        },

        validateClient: function(rut, ok, fail){
            var url = App.urls.get('clientes:validar') + '?rut=' + rut;

            $http.get(url).success(function(data){
                if(data.status){
                    ok();
                }else{
                    fail();
                }
            });
        }
    };

    return services;
}

module.exports = service;
