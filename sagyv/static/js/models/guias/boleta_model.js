function Boleta(){
    this.id = null;
    this.inicial = 0;
    this.ultima = 0;
    this.actual = 0;

    this.trabajador = {
        id: 0,
        nombre: null
    };

    this.mensajes = {};
}

Boleta.prototype = {
    constructor: Boleta
};

module.exports = Boleta;
