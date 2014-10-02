var Otro = require('./../../models/liquidacion/otro_model.js');

function OtroController($scope){
    this.scope = $scope;
    this.otro = null;
}

OtroController.mixin({
    resetearOtro: function(){
        this.otro = new Otro();
    },

    guardar: function(){
        if(!this.otro.esValido()){
            return;
        }

        this.scope.$emit("guia:agregaOtro", this.otro.getJSON());
        common.agregarMensaje("Se ha guardado otroModel exitosamente");
        $('#modal_otros').modal('hide');
    }
});

module.exports = OtroController;
