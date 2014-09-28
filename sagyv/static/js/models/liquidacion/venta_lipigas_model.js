var Venta = require('./venta_model.js');

function VentaLipigas(){
    Venta.call(this, 'lipigas');
}

VentaLipigas.mixin(Venta,{});

module.exports = VentaLipigas;
