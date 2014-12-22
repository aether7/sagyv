var Vehiculo = require('../models/vehiculo/vehiculo_model.js');

describe('Vehiculo', function(){
    describe('#esValido', function(){
        it('Debería no ser válido el primer vehículo con datos incompletos', function(){
            var vehiculo = new Vehiculo();
            vehiculo.esValido.should.be(false);
        });
    });
});
