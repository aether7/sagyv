(function(){
'use strict';
var app = angular.module('clienteApp', []),
    situacionComercialService = require('../services/cliente/situacion_comercial_service.js'),
    SituacionComercialController = require('../controllers/cliente/situacion_comercial_controller.js'),
    ClienteController = require('../controllers/cliente/cliente_controller.js');

app.factory('situacionComercialService', ['$http', situacionComercialService]);

app.factory('clienteService', ['$http', function($http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var services = {
        all: function(callback){
            var url = App.urls.get('clientes:obtener');
            $http.get(url).success(callback);
        },

        find: function(){

        },

        create: function(data, callback){
            var url = App.urls.get('clientes:crear');
            data = $.param(data);
            $http.post(url, data).success(callback);
        },

        update: function(){

        },

        remove: function(id, callback){
            var url = App.urls.get('clientes:eliminar'),
                data = { id : id };

            $http.post(url, data).success(callback);
        }
    };

    return services;
}]);

app.controller('ClienteController', ['clienteService','$rootScope', ClienteController]);
app.controller('SituacionComercialController', ['situacionComercialService','$rootScope', SituacionComercialController]);

})();
