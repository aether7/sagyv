var serviceUtil = require('./service_util.js');

function boletaService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findAll: function(callback){
            var boletas = [
                {
                    id: 1,
                    inicial: 1,
                    ultima: 50,
                    actual: 20,
                    trabajador: {
                        id: 3,
                        nombre: "alberto"
                    }
                },
                {
                    id: 2,
                    inicial: 51,
                    ultima: 100,
                    actual: 60,
                    trabajador: {
                        id: 2,
                        nombre: "juanito"
                    }
                },
                {
                    id: 3,
                    inicial: 101,
                    ultima: 200,
                    actual: 125,
                    trabajador: {
                        id: 3,
                        nombre: "mauricio"
                    }
                }
            ];

            callback(boletas);
        }
    };

    return services;
}

module.exports = boletaService;
