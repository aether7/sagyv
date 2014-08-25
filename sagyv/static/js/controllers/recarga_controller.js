function RecargaController($http){
    this.http = $http;
}

RecargaController.mixin({
    iniciarRecarga: function(){
        console.log("iniciando recarga");
        $("#modal_recargar_guia").modal("show");
    }
});

module.exports = RecargaController;
