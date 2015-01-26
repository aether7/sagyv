(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/cliente_bundle.js":[function(require,module,exports){
(function(){
'use strict';
var app = angular.module('clienteApp', []),
    formatoRut = require('../filters/string_filters.js').formatoRut,
    situacionComercialService = require('../services/cliente/situacion_comercial_service.js'),
    clienteService = require('../services/cliente/cliente_service.js'),
    SituacionComercialController = require('../controllers/cliente/situacion_comercial_controller.js'),
    ClienteController = require('../controllers/cliente/cliente_controller.js');

app.factory('situacionComercialService', ['$http', situacionComercialService]);
app.factory('clienteService', ['$http', clienteService]);

app.filter('formatoRut', formatoRut);

app.controller('ClienteController', ['clienteService','$rootScope', ClienteController]);
app.controller('SituacionComercialController', ['situacionComercialService','$rootScope', SituacionComercialController]);

})();

},{"../controllers/cliente/cliente_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/cliente/cliente_controller.js","../controllers/cliente/situacion_comercial_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/cliente/situacion_comercial_controller.js","../filters/string_filters.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/filters/string_filters.js","../services/cliente/cliente_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/cliente/cliente_service.js","../services/cliente/situacion_comercial_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/cliente/situacion_comercial_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/cliente/cliente_controller.js":[function(require,module,exports){
var Cliente = require('../../models/cliente/cliente_model.js');

function ClienteController(service, rootScope){
    this.scope = rootScope;
    this.service = service;
    this.index = null;
    this.clientes = [];
    this.cliente = null;
    this.init();
}

ClienteController.prototype = {
    constructor: ClienteController,
    init: function(){
        var _this = this;

        this.service.all(function(data){
            _this.clientes = data.map(function(c){
                var cliente = new Cliente();

                cliente.setSituacionComercial(c.situacionComercial);
                cliente.id = c.id;
                cliente.nombre = c.nombre;
                cliente.giro = c.giro;
                cliente.rut = c.rut;
                cliente.direccion = c.direccion;
                cliente.telefono = c.telefono;
                cliente.propio = c.propio;
                cliente.lipigas = c.lipigas;
                cliente.dispensador = c.dispensador;
                cliente.credito = c.credito;
                cliente.observacion = c.observacion;

                return cliente;
            });
        });
    },

    nuevo: function(){
        this.cliente = new Cliente();
        $('#modal_agregar').modal('show');
    },

    editar: function(index){
        this.index = index;
        this.cliente = this.clientes[index];
        $('#modal_editar').modal('show');
    },

    eliminar: function(index){
        if(!confirm('¿ Está seguro(a) de eliminar a este cliente ?')){
            return;
        }

        var cliente = this.clientes[index],
            _this = this;

        this.service.remove(cliente.id, function(){
            _this.clientes.splice(index, 1);
            common.agregarMensaje('El cliente fue eliminado exitosamente');
        });
    },

    ver: function(index){
        this.cliente = this.clientes[index];
        $('#modal_ver').modal('show');
    },

    crear: function(){
        this.cliente.mensajes.rut = null;

        if(!this.cliente.esValido()){
            return;
        }

        var _this = this, ok, fallo;

        ok = function(){
            _this.service.create(_this.cliente.toJSON(), _this.procesarCrear.bind(_this));
        };

        fallo = function(){
            _this.cliente.mensajes.rut = "Ya existe otro cliente con ese Rut";
        };

        this.validarRut().ok(ok).fallo(fallo).doRequest();
    },

    procesarCrear: function(data){
        this.cliente.id = data.id;
        this.cliente.setSituacionComercial(data.situacionComercial);
        this.clientes.push(this.cliente);

        $('#modal_agregar').modal('hide');
        common.agregarMensaje('El cliente fue agregado exitosamente');
    },

    actualizar: function(){
        if(!this.cliente.esValido()){
            return;
        }

        this.service.update(this.cliente.toJSON(), this.procesarActualizar.bind(this));
    },

    procesarActualizar: function(data){
        this.clientes[this.index] = this.cliente;

        $('#modal_editar').modal('hide');
        common.agregarMensaje('El cliente ha sido actualizado exitosamente');
    },

    validarRut: function(){
        var okResponse = null,
            falloResponse = null,
            _this = this;

        return {
            ok: function(func){
                okResponse = func;
                return this;
            },
            fallo: function(func){
                falloResponse = func;
                return this;
            },
            doRequest: function(){
                _this.service.validateClient(_this.cliente.rut, okResponse, falloResponse);
                return this;
            }
        };
    }
};

module.exports = ClienteController;

},{"../../models/cliente/cliente_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/cliente/cliente_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/cliente/situacion_comercial_controller.js":[function(require,module,exports){
var SituacionComercial = require('../../models/cliente/situacion_comercial_model.js');

function SituacionComercialController(service, rootScope){
    this.scope = rootScope;
    this.service = service;
    this.index = null;
    this.situacionComercial = new SituacionComercial();
    this.init();
}

SituacionComercialController.prototype = {
    constructor: SituacionComercialController,

    init: function(){
        var _this = this;

        this.service.all(function(data){
            _this.scope.situacionesComerciales = data.map(function(d){
                var situacionComercial = new SituacionComercial();

                situacionComercial.id = d.id;
                situacionComercial.monto = d.monto;
                situacionComercial.producto = d.producto;
                situacionComercial.tipoDescuento = d.tipoDescuento;

                return situacionComercial;
            });
        });
    },

    nueva: function(){
        this.situacionComercial = new SituacionComercial();
        $('#modal_agregar_situacion').modal('show');
    },

    editar: function(index){
        this.index = index;
        this.situacionComercial = this.scope.situacionesComerciales[index];
        $('#modal_editar_situacion').modal('show');
    },

    eliminar: function(index){

    },

    crear: function(){
        if(!this.situacionComercial.esValido()){
            return;
        }

        var optProducto = $('#sit_producto_add option:selected'),
            tipoDesc = $('#sit_tipo_add option:selected');

        this.situacionComercial.tipoDescuento.tipo = tipoDesc.text();
        this.situacionComercial.producto.codigo = optProducto.data('codigo');
        this.situacionComercial.producto.nombre = optProducto.data('nombre');

        this.service.create(this.situacionComercial.toJSON(), this.procesarCrear.bind(this));
    },

    procesarCrear: function(data){
        this.situacionComercial.id = data.id;
        this.scope.situacionesComerciales.push(this.situacionComercial);
        $('#modal_agregar_situacion').modal('hide');
        common.agregarMensaje('La situación comercial fue creada exitosamente');
    },

    actualizar: function(){
        if(!this.situacionComercial.esValido()){
            return;
        }

        this.service.update(this.situacionComercial.toJSON(), this.procesarActualizar.bind(this));
    },

    procesarActualizar: function(data){
        this.scope.situacionesComerciales[this.index] = this.situacionComercial;
        $('#modal_editar_situacion').modal('hide');
        common.agregarMensaje('La situación comercial fue editada exitosamente');
    }
};

module.exports = SituacionComercialController;

},{"../../models/cliente/situacion_comercial_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/cliente/situacion_comercial_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/filters/string_filters.js":[function(require,module,exports){
function formatoRut(){
    return function(input){
        var rut, dv, str, i;

        rut = input.split('-');
        dv = rut[1];
        rut = rut[0];
        str = '';
        rut = rut.split('').reverse();

        for(i = 0; i < rut.length; i++){
            if(i !== 0 && i % 3 === 0){
                str += '.';
            }

            str += rut[i];
        }

        str = str.split('').reverse().join('') + '-' + dv;
        return str;
    };
}

module.exports.formatoRut = formatoRut;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/cliente/cliente_model.js":[function(require,module,exports){
var SituacionComercial = require('./situacion_comercial_model.js');

function Cliente(){
    this.id = null;
    this.nombre = null;
    this.giro = null;
    this.rut = null;
    this.telefono = null;
    this.direccion = null;
    this.situacionComercial = null;
    this.credito = null;
    this.dispensador = null;
    this.propio = null;
    this.lipigas = null;
    this.observacion = null;

    this.situacionComercialObj = null;
    this.mensajes = {};
}

Cliente.prototype = {
    constructor: Cliente,

    setSituacionComercial: function(situacionComercial){
        if(!situacionComercial){
            return;
        }

        this.situacionComercial = new SituacionComercial();
        this.situacionComercial.id = situacionComercial.id;
        this.situacionComercial.monto = situacionComercial.monto;
        this.situacionComercial.producto = situacionComercial.producto;
        this.situacionComercial.tipoDescuento = situacionComercial.tipoDescuento;
    },

    setStringSituacion: function(){
        if(!this.situacionComercialObj){
            return;
        }

        var obj = JSON.parse(this.situacionComercialObj);
        this.situacionComercial = new SituacionComercial();
        this.situacionComercial.id = obj.id;
        this.situacionComercial.monto = obj.monto;
        this.situacionComercial.producto = obj.producto;
        this.situacionComercial.tipoDescuento = obj.tipoDescuento;
    },

    getSituacionComercial: function(){
        if(!this.situacionComercial){
            return 'Sin descuento';
        }else{
            return this.situacionComercial.getTipoDescuento();
        }
    },

    toJSON: function(){
        this.setStringSituacion();

        var json = {
            nombre: this.nombre,
            giro: this.giro,
            rut: this.rut,
            telefono: this.telefono,
            direccion: this.direccion,
            credito: this.credito,
            dispensador: this.dispensador,
            lipigas: this.lipigas,
            propio: this.propio,
            observacion: this.observacion,
            situacionComercialId: this.situacionComercial ? this.situacionComercial.id : null
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this._nombreValido() && valido;
        valido = this._giroValido() && valido;
        valido = this._rutValido() && valido;
        valido = this._telefonoValido() && valido;

        return valido;
    },

    _nombreValido: function(){
        if(!this.nombre){
            this.mensajes.nombre = 'campo requerido';
            return false;
        }

        return true;
    },

    _giroValido: function(){
        if(!this.giro){
            this.mensajes.giro = 'campo requerido';
            return false;
        }

        return true;
    },

    _rutValido: function(){
        if(!this.rut){
            this.mensajes.rut = 'campo requerido';
            return false;
        }else if(!$.Rut.validar(this.rut)){
            this.mensajes.rut = 'RUT inválido';
            return false;
        }

        return true;
    },

    _telefonoValido: function(){
        if(!this.telefono){
            this.mensajes.telefono = 'campo requerido';
            return false;
        }else if(isNaN(this.telefono)){
            this.mensajes.telefono = 'teléfono inválido';
            return false;
        }

        return true;
    },

    _direccionValido: function(){
        if(!this.direccion){
            this.mensajes.direccion = 'campo requerido';
            return false;
        }

        return true;
    }
};

module.exports = Cliente;

},{"./situacion_comercial_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/cliente/situacion_comercial_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/cliente/situacion_comercial_model.js":[function(require,module,exports){
function SituacionComercial(){
    this.id = null;
    this.monto = null;
    this.tipoDescuento = { id: null, tipo: null };
    this.producto = { id: null, codigo: null, nombre: null };

    this.mensajes = {};
}

SituacionComercial.prototype = {
    constructor: SituacionComercial,

    getTipoDescuento: function(){
        var str = '';

        if(this.tipoDescuento.id === 1){
            str += '$ ' + this.monto + ' en (' + this.producto.codigo + ')';
        }else if(this.tipoDescuento.id === 2){
            str += this.monto + ' % en (' + this.producto.codigo + ')';
        }

        return str;
    },

    esValido: function(){
        var valido = true;
        this.mensajes = {};

        valido = this._montoValido() && valido;
        valido = this._tipoDescuentoValido() && valido;
        valido = this._productoValido() && valido;

        return valido;
    },

    _montoValido: function(){
        if(!this.monto){
            this.mensajes.monto = 'Campo obligatorio';
            return false;
        }else if(isNaN(this.monto)){
            this.mensajes.monto = 'Número inválido';
            return false;
        }else if(parseInt(this.monto) < 1){
            this.mensajes.monto = 'El monto a ingresar debe ser al menos 1';
            return false;
        }

        return true;
    },

    _tipoDescuentoValido: function(){
        if(!this.tipoDescuento.id){
            this.mensajes.tipoDescuento = 'Debe seleccionar un tipo de descuento';
            return false;
        }

        return true;
    },

    _productoValido: function(){
        if(!this.producto.id){
            this.mensajes.producto = 'Debe elegir un formato de descuento';
            return false;
        }

        return true;
    },

    toJSON: function(){
        var json = {
            monto: this.monto,
            tipoDescuento: JSON.stringify(this.tipoDescuento),
            producto: JSON.stringify(this.producto)
        };

        if(this.id){
            json.id = this.id;
        }

        return json;
    }
};

module.exports = SituacionComercial;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/cliente/cliente_service.js":[function(require,module,exports){
function service($http){
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var services = {
        all: function(callback){
            var url = App.urls.get('clientes:obtener');
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/cliente/situacion_comercial_service.js":[function(require,module,exports){
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

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/cliente_bundle.js"]);
