function Dump(){
    this.productos = null;
    this.cheques = null;
    this.cuponesPrepago = null;
    this.otros = null;
    this.vouchers = null;
    this.guia = null;
    this.montos = null;

    this.guias = [];
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

    setGuia: function(guia){
        console.log(guia);
        this.guias.push(guia);
    },

    setMontos: function(){

    },

    toJSON: function(){
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
