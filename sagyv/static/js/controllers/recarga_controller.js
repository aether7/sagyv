function RecargaController($http){
    this.http = $http;
    this.recarga = null;
    this.producto = {};
}

RecargaController.mixin({
    iniciarRecarga: function(){
        this.recarga = new App.Models.Recarga();
        $("#modal_recargar_guia").modal("show");
    },

    agregarRecarga: function(){
        if(this.producto.id && this.producto.cantidad){
            this.producto.codigo = $("#" + idSelect + " option:selected").text();
        }

        console.log(this.producto);
    }
});

module.exports = RecargaController;
