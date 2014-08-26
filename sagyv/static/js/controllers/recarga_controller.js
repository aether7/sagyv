function RecargaController($http){
    this.http = $http;
    this.recarga = null;
}

RecargaController.mixin({
    iniciarRecarga: function(){
        this.recarga = new App.Models.Recarga();

        console.log("iniciando recarga");
        $("#modal_recargar_guia").modal("show");
    }
});

module.exports = RecargaController;
