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
}

Dump.prototype = {
    constructor: Dump,

    setProductos: function(productos){
        this.productos = JSON.stringify(productos);
    },

    setCheques: function(cheques){
        this.cheques = JSON.stringify(cheques);
    },

    setCuponesPrepago: function(cuponesPrepago){
        this.cuponesPrepago = JSON.stringify(cuponesPrepago);
    },

    setOtros: function(otros){
        this.otros = JSON.stringify(otros);
    },

    setVouchers: function(vouchers){
        this.vouchers = JSON.stringify(vouchers);
    },

    setGuias: function(propias, lipigas){
        this.propias = JSON.stringify(propias.ventas);
        this.lipigas = JSON.stringify(lipigas.ventas);
    },

    setMontos: function(){

    },

    toJSON: function(){
        this.guias.propias = this.propias;
        this.guias.lipigas = this.lipigas;
        return {
            'productos': this.productos,
            'cheques': this.cheques,
            'cuponesPrepago': this.cuponesPrepago,
            'otros': this.otros,
            'vouchers': this.vouchers,
            'guias': JSON.stringify(this.guias)
        };
    }
};

module.exports = Dump;
