var Venta = require('./venta_model.js');

function VentaPropia(){
    Venta.call(this, 'propia');
}

VentaPropia.mixin(Venta,{});

module.exports = VentaPropia;
