var Guia = require('../models/guias/guia_model.js'),
    assert = require('assert');

describe('Guia', function(){
    describe('#esInicialValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var guia = new Guia();
            assert.equal(guia.esInicialValido(), false);
        });

        it('Debería ser falso si no es un numero válido', function(){
            var guia = new Guia();
            guia.inicial = 'psh psh psh';
            assert.equal(guia.esInicialValido(), false);
        });

        it('Debería ser falso si es un número menor a 1', function(){
            var guia = new Guia();
            guia.inicial = -1;
            assert.equal(guia.esInicialValido(), false);
        });

        it('Debería ser verdadero si es un número mayor o igual a uno', function(){
            var guia = new Guia();
            guia.inicial = 1;
            assert.equal(guia.esInicialValido(), true);
        });
    });

    describe('#esUltimaValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var guia = new Guia();
            assert.equal(guia.esUltimaValido(), false);
        });

        it('Debería ser falso si no es un número valido', function(){
            var guia = new Guia();
            guia.ultima = 'psh psh psh';
            assert.equal(guia.esUltimaValido(), false);
        });

        it('Debería ser falso si es un número menor a 1', function(){
            var guia = new Guia();
            guia.ultima = -1;
            assert.equal(guia.esUltimaValido(), false);
        });

        it('Deberia ser falso si el inicial es mayor o igual al último', function(){
            var guia = new Guia();
            guia.inicial = 2;
            guia.ultima = 1;
            assert.equal(guia.esUltimaValido(), false);
        });

        it('Debería ser verdadero si el inicial es menor que el ultimo', function(){
            var guia = new Guia();
            guia.inicial = 1;
            guia.ultima = 2;
            assert.equal(guia.esUltimaValido(), true);
        });
    });

    describe('#esTrabajadorValido', function(){
        it('Debería ser falso si no se escoge un trabajador con id distinto a 0', function(){
            var guia = new Guia();
            assert.equal(guia.esTrabajadorValido(), false);

            guia.trabajador.id = 0;
            assert.equal(guia.esTrabajadorValido(), false);
        });

        it('Debería ser verdadero si el trabajador tiene un id mayor a cero', function(){
            var guia = new Guia();
            guia.trabajador.id = 1;
            assert.equal(guia.esTrabajadorValido(), true);
        });
    });

    describe('#esValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var guia = new Guia();
            assert.equal(guia.esValido(), false);
        });

        it('Debería ser verdadero si se llenan todos los campos de manera correcta', function(){
            var guia = new Guia();
            guia.inicial = 1;
            guia.ultima = 2;
            guia.trabajador.id = 1;
            assert.equal(guia.esValido(), true);
        });
    });

    describe('#toJSON', function(){
        it('Debería mostrar un json valido sin id', function(){
            var guia = new Guia(), json;
            guia.inicial = 1;
            guia.ultima = 2;
            guia.trabajador.id = 1;

            json = guia.toJSON();
            assert.equal(json.inicial, 1);
        });

        it('Debería mostrar un json valido con id', function(){
            var guia = new Guia(), json;
            guia.inicial = 1;
            guia.ultima = 2;
            guia.trabajador.id = 1;
            guia.id = 1;

            json = guia.toJSON();
            assert.equal(json.id, 1);
        });
    });
});
