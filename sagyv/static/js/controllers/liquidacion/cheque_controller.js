function ChequeController($http, $scope){
    this.http = $http;
    this.scope = $scope;
    this.cheque = App.Models.Cheque();
}

ChequeController.mixin({
    //insert magic here
    agregarCheque: function(){
        if(!this.cheque.esValido()){
            return
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
