App.Models.Recarga = function(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.fecha = new Date().toLocaleString();
    this.productos = [];
    this.productos_recarga = [];
    this.observaciones = null;

    this.mensajes = {};
};

App.Models.Recarga.prototype = {
    construtor: App.Models.Recarga
};
