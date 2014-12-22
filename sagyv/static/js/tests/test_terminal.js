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
    Terminal = require('../models/guias/terminal_model.js');

describe('Terminal', function(){
    describe('#toJSON', function(){
        it('Debe crear el json correctamente cuando no tiene id', function(){
            var terminal = new Terminal(), json;

            terminal.movil.id = 3;
            terminal.codigo = 'sadf45';
            json = terminal.toJSON();

            assert.equal(terminal.codigo, 'sadf45');
        });

        it('Debe crear el json correctamente cuando tiene id', function(){
            var terminal = new Terminal(), json;

            terminal.id = 1;
            terminal.movil.id = 3;
            terminal.codigo = 'sadf45';
            json = terminal.toJSON();

            assert.equal(terminal.id, 1);
        });
    });

    describe('#esValido', function(){
        it('No debería aceptar terminales sin numero ni movil', function(){
            var terminal = new Terminal();

            assert.equal(terminal.esValido(), false);

            assert.equal(terminal.mensajes.codigo, 'Campo obligatorio');
            assert.equal(terminal.mensajes.movil, 'Campo obligatorio');
        });

        it('No debería aceptar terminales sin numero', function(){
            var terminal = new Terminal();
            terminal.movil.id = 3;

            assert.equal(terminal.esValido(), false);
            assert.equal(terminal.mensajes.codigo, 'Campo obligatorio');
        });

        it('No debería aceptar terminales sin terminal', function(){
            var terminal = new Terminal();
            terminal.codigo = 'asdf15';

            assert.equal(terminal.esValido(), false);
            assert.equal(terminal.mensajes.movil, 'Campo obligatorio');
        });

        it('Debería ser valido con todo completado', function(){
            var terminal = new Terminal(), json;
            terminal.movil.id = 3;
            terminal.codigo = 'sadf15';

            assert.equal(terminal.esValido(), true);
        });
    });
});
