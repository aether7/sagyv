var Cheque = require('./../../models/liquidacion/cheque_model.js');

function ChequeController($http, $scope){
    this.http = $http;
    this.scope = $scope;
    this.cheque = new Cheque();
}

ChequeController.mixin({
    //insert magic here
    agregarCheque: function(){
        console.log(this.cheque);

        if(!this.cheque.esValido()){
            console.log(this.cheque.mensajes.banco);
            return;
        }

        some = {
            banco : this.cheque.banco,
            numero : this.cheque.numero,
            monto : this.cheque.monto,
            fecha : this.cheque.fecha
        };

        this.cheque.cheques.push(some);
    },

    removeCheque: function(indice){
        this.cheque.cheques.splice(indice, 1);
    },

    //se guardara 1 x 1 (?)
});

module.exports = ChequeController;
