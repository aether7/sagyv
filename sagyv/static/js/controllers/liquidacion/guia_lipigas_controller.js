var GuiaPropiaController = require('./guia_propia_controller.js'),
    mixin = require('./mixins.js').guias,
    VentaLipigas = require('./../../models/liquidacion/venta_lipigas_model.js');

function GuiaLipigasController($scope, service, calcularRestanteService){
    GuiaPropiaController.call(this, $scope, service, calcularRestanteService);
}

GuiaLipigasController.mixin(GuiaPropiaController, {
    esValido: mixin.esValido,

    resetearGuia: function(){
        this.idCliente = null;
        this.descripcionDescuento = 'nada';
        this.producto = {};
        this.venta = new VentaLipigas();
    },

    guardar: function(){
        if(!this.esValido()){
            return;
        }

        this.venta.tipoVenta = 'lipigas';
        this.venta.cliente.idCliente = this.idCliente;

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía lipigas exitosamente');
        $('#modal_guia_lipigas').modal('hide');
    }
});

module.exports = GuiaLipigasController;
