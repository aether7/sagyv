function Dump(){
    this.productos = null;
    this.cheques = null;
    this.cuponesPrepago = null;
    this.otros = null;
    this.vouchers = null;
    this.guia = null;
    this.montos = null;

    this.guias = {
        propias : null,
        lipigas : null
    };
    this.propias = [];
    this.lipigas = [];

    this.mensajes = [];
}

Dump.prototype = {
    constructor: Dump,

    setProductos: function(productos){
        this.productos = productos;
    },

    setCheques: function(cheques){
        this.cheques = cheques;
    },

    setCuponesPrepago: function(cuponesPrepago){
        this.cuponesPrepago = cuponesPrepago;
    },

    setOtros: function(otros){
        this.otros = otros;
    },

    setVouchers: function(vouchers){
        this.vouchers = vouchers;
    },

    setGuias: function(propias, lipigas){
        this.propias = propias.ventas;
        this.lipigas = lipigas.ventas;
    },

    setMontos: function(){

    },

    toJSON: function(){
        this.guias.propias = JSON.stringify(this.propias);
        this.guias.lipigas = JSON.stringify(this.lipigas);

        return {
            'productos': JSON.stringify(this.productos),
            'cheques': JSON.stringify(this.cheques),
            'cuponesPrepago': JSON.stringify(this.cuponesPrepago),
            'otros': JSON.stringify(this.otros),
            'vouchers': JSON.stringify(this.vouchers),
            'guias': JSON.stringify(this.guias)
        };
    }
};

module.exports = Dump;
