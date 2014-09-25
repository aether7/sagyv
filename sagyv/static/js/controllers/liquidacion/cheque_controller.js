var Cheque = require('./../../models/liquidacion/cheque_model.js');

function ChequeController($http, $scope){
    this.http = $http;
    this.scope = $scope;
    this.cheque = null;
    this.mensajes = {};
}

ChequeController.mixin({
    resetearCheque: function(){
        this.cheque = new Cheque();
    },

    addCheque: function(){
        if(!this.cheque.esValido()){
            return;
        }

        this.cheque.cheques.push(this.cheque.getJSON());
        this.cheque.clearData();
    },

    removeCheque: function(indice){
        this.cheque.cheques.splice(indice, 1);
    },

    guardar: function(){
        console.log('Aqui');

        this.cheque.mensajes.cheques=""
        if(!this.cheque.cheques.length){
            console.log('UHM');
            this.cheque.mensajes.cheques="Debe tener al menos 1 cheque";
            return;
        }
        console.log('Guarde');
        this.scope.$emit('guia:agregarCheques', this.cheque.cheques);
        common.agregarMensaje('Se ha guardado los cheques exitosamente');
        $('#modal_cheque').modal('hide');

    }
});

module.exports = ChequeController;
