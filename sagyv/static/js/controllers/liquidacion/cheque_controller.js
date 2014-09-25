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
    },

    removeCheque: function(indice){
        this.cheque.cheques.splice(indice, 1);
    },

    //se guardara 1 x 1 (?)
});

module.exports = ChequeController;
