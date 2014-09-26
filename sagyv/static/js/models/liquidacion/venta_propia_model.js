var Venta = require('./venta_model.js');

function VentaPropia(){
    Venta.call(this, 'propia');
}

VentaPropia.mixin({});

module.exports = VentaPropia;
