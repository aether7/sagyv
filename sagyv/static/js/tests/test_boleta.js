var Boleta = require('../models/guias/boleta_model.js'),
    assert = require('assert');

describe('Boleta', function(){
    describe('#esInicialValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var boleta = new Boleta();
            assert.equal(boleta.esInicialValido(), false);
        });

        it('Debería ser falso si no es un numero válido', function(){
            var boleta = new Boleta();
            boleta.inicial = 'psh psh psh';
            assert.equal(boleta.esInicialValido(), false);
        });

        it('Debería ser falso si es un número menor a 1', function(){
            var boleta = new Boleta();
            boleta.inicial = -1;
            assert.equal(boleta.esInicialValido(), false);
        });

        it('Debería ser verdadero si es un número mayor o igual a uno', function(){
            var boleta = new Boleta();
            boleta.inicial = 1;
            assert.equal(boleta.esInicialValido(), true);
        });
    });

    describe('#esUltimaValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var boleta = new Boleta();
            assert.equal(boleta.esUltimaValido(), false);
        });

        it('Debería ser falso si no es un número valido', function(){
            var boleta = new Boleta();
            boleta.ultima = 'psh psh psh';
            assert.equal(boleta.esUltimaValido(), false);
        });

        it('Debería ser falso si es un número menor a 1', function(){
            var boleta = new Boleta();
            boleta.ultima = -1;
            assert.equal(boleta.esUltimaValido(), false);
        });

        it('Deberia ser falso si el inicial es mayor o igual al último', function(){
            var boleta = new Boleta();
            boleta.inicial = 2;
            boleta.ultima = 1;
            assert.equal(boleta.esUltimaValido(), false);
        });

        it('Debería ser verdadero si el inicial es menor que el ultimo', function(){
            var boleta = new Boleta();
            boleta.inicial = 1;
            boleta.ultima = 2;
            assert.equal(boleta.esUltimaValido(), true);
        });
    });

    describe('#esTrabajadorValido', function(){
        it('Debería ser falso si no se escoge un trabajador con id distinto a 0', function(){
            var boleta = new Boleta();
            assert.equal(boleta.esTrabajadorValido(), false);

            boleta.trabajador.id = 0;
            assert.equal(boleta.esTrabajadorValido(), false);
        });

        it('Debería ser verdadero si el trabajador tiene un id mayor a cero', function(){
            var boleta = new Boleta();
            boleta.trabajador.id = 1;
            assert.equal(boleta.esTrabajadorValido(), true);
        });
    });

    describe('#esValido', function(){
        it('Debería ser falso si no se agrega nada', function(){
            var boleta = new Boleta();
            assert.equal(boleta.esValido(), false);
        });

        it('Debería ser verdadero si se llenan todos los campos de manera correcta', function(){
            var boleta = new Boleta();
            boleta.inicial = 1;
            boleta.ultima = 2;
            boleta.trabajador.id = 1;
            assert.equal(boleta.esValido(), true);
        });
    });

    describe('#toJSON', function(){
        it('Debería mostrar un json valido sin id', function(){
            var boleta = new Boleta(), json;
            boleta.inicial = 1;
            boleta.ultima = 2;
            boleta.trabajador.id = 1;

            json = boleta.toJSON();
            assert.equal(json.inicial, 1);
        });

        it('Debería mostrar un json valido con id', function(){
            var boleta = new Boleta(), json;
            boleta.inicial = 1;
            boleta.ultima = 2;
            boleta.trabajador.id = 1;
            boleta.id = 1;

            json = boleta.toJSON();
            assert.equal(json.id, 1);
        });
    });
});
