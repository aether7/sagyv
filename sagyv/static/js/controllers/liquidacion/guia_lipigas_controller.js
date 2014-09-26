var GuiaPropiaController = require('./guia_propia_controller.js');

function GuiaLipigasController($scope, service){
    GuiaPropiaController.call(this, $scope, service);
}

GuiaLipigasController.mixin(GuiaPropiaController, {
    guardar: function(){
        this.venta.tipoVenta = 'lipigas';

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía lipigas exitosamente');
        $('#modal_guia_lipigas').modal('hide');
    }
});

module.exports = GuiaLipigasController;
