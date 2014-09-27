function GuiaVenta(){
    this.propia = {
        rowspan: 0,
        ventas: []
    };

    this.lipigas = {
        rowspan: 0,
        ventas: []
    };
}

GuiaVenta.mixin({
    addGuia: function(guia){
        if(guia.tipo !== 'propia' && guia.tipo !== 'lipigas'){
            throw TypeError('La guia ingresada no es ni lipigas ni es propia, es ' + guia.tipo);
        }

        if(guia.tipo === 'propia'){
            this._addGuiaPropia(guia);
        }else{
            this._addGuiaLipigas(guia);
        }
    },

    _addGuiaPropia: function(guiaPropia){
        this.propia.ventas.push(guiaPropia);
        this._addRowspan('propia', guiaPropia);
    },

    _addGuiaLipigas: function(guiaLipigas){
        this.lipigas.ventas.push(guiaLipigas);
        this._addRowspan('lipigas', guiaLipigas);
    },

    _addRowspan: function(tipo, guia){
        console.log('a calcular el rowspan mierda');
        this[tipo].rowspan += guia.productos.length;
        console.log('rowspan actual : ' + this[tipo].rowspan);
    }
});

module.exports = GuiaVenta;
