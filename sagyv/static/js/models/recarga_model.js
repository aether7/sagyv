App.Models.Recarga = function(){
    this.id = null;
    this.numero = null;
    this.vehiculo = null;
    this.fecha = new Date();
    this.productos = [];
    this.productos_recarga = [];
    this.observaciones = null;

    this.mensajes = {};
};
App.Models.Guia.prototype = {
    construtor: App.Models.Guia,
}
