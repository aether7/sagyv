Function.prototype.method = function(method, func){
    this.prototype[method] = func;
};

Function.method('mixin', function(klass, newProperties){
    var args, proto;

    args = [].slice.call(arguments);
    newProperties = args.pop();
    klass = args[0] || null;
    proto = klass && Object.create(klass.prototype) || {};

    for(var property in newProperties){
        if(!newProperties.hasOwnProperty(property)){
            continue;
        }

        if(typeof proto[property] === "function"){
            proto[property] = (function(oldFn, fn){
                return function(){
                    this._super = oldFn;
                    var ret = fn.apply(this, arguments);
                    return ret;
                };
            })(proto[property], newProperties[property]);
        }else{
            proto[property] = newProperties[property];
        }
    }

    proto.constructor = this;
    this.prototype = proto;
});

var assert = require('assert'),
    Vehiculo = require('../models/vehiculo/vehiculo_model.js');

describe('Vehiculo', function(){
    describe('#esValido', function(){
        it('No válido cuando primer vehículo con datos incompletos', function(){
            var vehiculo = new Vehiculo();
            assert.equal(vehiculo.esValido(), false);
        });

        it('No válido cuando falta patente válida y kilometraje invalido', function(){
            var vehiculo = new Vehiculo();
            vehiculo.numero = 13;
            vehiculo.patente = 'eae';
            vehiculo.fechaValida = new Date();
            vehiculo.kilometraje = -3;

            assert.equal(vehiculo.esValido(), false);
            assert.equal(vehiculo.mensaje.patente, 'Patente inválida');
            assert.equal(vehiculo.mensaje.kilometraje, 'Ingrese numero mayor o igual a 0');
        });

        it('Debería entregar chofer no anexado', function(){
            var vehiculo = new Vehiculo();
            assert.equal(vehiculo.getNombreChofer(), 'No anexado');
        });
    });
});
