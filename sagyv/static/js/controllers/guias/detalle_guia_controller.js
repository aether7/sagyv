function DetalleGuiaController(service){
    this.service = service;
    this.guia = null;
}

DetalleGuiaController.mixin({
    ver: function(guia){
        var _this = this;

        this.service.detalleTalonario(guia.id, function(data){
            _this.guia = guia;
            $('#modal_guia_detalle').modal('show');
        });
    }
});

module.exports = DetalleGuiaController;
