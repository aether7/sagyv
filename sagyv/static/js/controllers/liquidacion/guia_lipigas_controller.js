var GuiaPropiaController = require('./guia_propia_controller.js'),
    VentaLipigas = require('./../../models/liquidacion/venta_lipigas_model.js');

function GuiaLipigasController($scope, service){
    GuiaPropiaController.call(this, $scope, service);
}

GuiaLipigasController.mixin(GuiaPropiaController, {
    resetearGuia: function(){
        this.idCliente = null;
        this.descripcionDescuento = 'nada';
        this.venta = new VentaLipigas();
    },

    guardar: function(){
        this.venta.tipoVenta = 'lipigas';
        this.venta.cliente.idCliente = this.idCliente;

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía lipigas exitosamente');
        $('#modal_guia_lipigas').modal('hide');
    }
});

module.exports = GuiaLipigasController;
