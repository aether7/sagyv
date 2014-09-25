var Producto = require('./../../models/liquidacion/producto_model.js'),
    Venta = require('./../../models/liquidacion/venta_model.js');

function GuiaLipigasController(){
    this.venta = null;
}

GuiaLipigasController({
    resetearGuia: function(){
        this.venta = new Venta();
    }
});

module.exports = GuiaLipigasController;
