App.Controllers.Cliente = function(){
    this.rutList = [];
    this.idCliente = null;
    this.cliente = null;
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    verCliente: function(id){
        var url = App.urls.get("clientes:obtener").replace("0", id),
            urlSitComercial = App.urls.get("clientes:obtener_situacion_comercial"),
            urlProducto = App.urls.get("clientes:buscar_producto");

        function callback(data, dataB, dataC){
            data.situacion_comercial = dataB;
            data.producto = dataC;
            pubsub.publish("cliente:verCliente", [ data ]);
        }

        $.get(url, function(data){
            urlSitComercial = urlSitComercial.replace("0", data.situacion_comercial);
            $.get(urlSitComercial, function(dataB){
                if(dataB.id === 1){
                    callback(data, dataB, null);
                    return;
                }

                $.get(urlProducto,{ producto_id: dataB.formato_descuento }, function(dataC){
                    data.situacion_comercial = dataB;
                    data.producto = dataC;
                    pubsub.publish("cliente:verCliente", [ data ]);
                });
            });
        });
    },

    addClienteRut: function(rut){
        this.rutList.push(rut);
    },

    buscarCliente: function(busqueda, opcion, action){
        var _this = this,
            json = {
                busqueda : busqueda,
                opcion : opcion
            };

        $.get(action, json, function(data){
            pubsub.publish("cliente:buscar", [ data ]);
        });
    },

    cargarCliente: function(id){
        var url = App.urls.get("clientes:obtener").replace("0", id),
            _this = this;

        _this.idCliente = id;
        $.get(url, function(data){
            pubsub.publish("cliente:cargarCliente", [ data ]);
        });
    },

    eliminarCliente: function(id){
        var _this = this,
            url = App.urls.get("clientes:eliminar");

        $.post(url, { id_cliente : id }, function(data){
            pubsub.publish("cliente:removerCliente",[ data ]);

            rut = data.rut;

            if(_.indexOf(_this.rutList, rut) !== -1){
                _this.rutList = _.without(_this.rutList, rut);
            }
        });
    },

    guardarAdd: function(data){
        var url,
            cliente = new App.Models.Cliente(),
            data = Object.create(data),
            _this = this;

        cliente.nombre = data.nombre;
        cliente.giro = data.giro;
        cliente.direccion = data.direccion;
        cliente.telefono = data.telefono;
        cliente.rut = data.rut;
        cliente.situacionComercial = data.situacionComercial;
        cliente.credito = data.credito;
        cliente.dispensador = data.dispensador;
        cliente.esLipigas = data.es_lipigas;
        cliente.esPropio = data.es_propio;
        cliente.observacion = data.observacion;
        cliente.cantidad = data.cantidad;
        cliente.tipo = data.tipo;
        cliente.producto = data.producto;

        if(!cliente.esValido()){
            pubsub.publish("cliente:noValido", [ cliente.getErrorList() ]);
            return;
        }

        url = App.urls.get("clientes:crear");
        json = cliente.getJSON();

        $.post(url, json, function(data){
            pubsub.publish("cliente:procesarCrear", [ data ]);
        });
    },

    guardarUpdate: function(data){
        var url,
            cliente = new App.Models.Cliente(),
            data = Object.create(data),
            _this = this;

        cliente.nombre = data.nombre;
        cliente.giro = data.giro;
        cliente.direccion = data.direccion;
        cliente.telefono = data.telefono;
        cliente.rut = data.rut;
        cliente.situacionComercial = data.situacionComercial;
        cliente.credito = data.credito;
        cliente.dispensador = data.dispensador;
        cliente.es_lipigas = data.es_lipigas;
        cliente.observacion = data.observacion;
        cliente.cantidad = data.cantidad;
        cliente.tipo = data.tipo;
        cliente.producto = data.producto;
        cliente.idCliente = _this.idCliente;

        if(!cliente.esValido()){
            pubsub.publish("cliente:noValido", [ cliente.getErrorList() ]);
            return;
        }

        url = App.urls.get("clientes:update");
        json = cliente.getJSON();

        $.post(url, json, function(data){
            pubsub.publish("cliente:actualizarCliente", [ data ]);
        });
    }
};
