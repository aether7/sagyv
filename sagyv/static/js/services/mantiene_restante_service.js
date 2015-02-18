function mantieneRestanteService(){
    var hash = {}, calculaRestantes;

    calculaRestantes = function(p, index){
        if(typeof p.disponibles === 'undefined'){
            p.disponibles = parseInt(p.vacios);
        }

        hash[p.codigo] = { index: index, disponibles: p.disponibles };
        return p;
    };

    return {
        calculaRestantes: function(arr){
            arr.map(calculaRestantes);
            return arr;
        },

        restar: function(productos, arr){
            arr.forEach(function(a){
                hash[a.codigo].disponibles -= parseInt(a.cantidad);
            });

            productos.map(function(p){
                var disponibles = parseInt(hash[p.codigo].disponibles);
                p.disponibles = disponibles;
                return p;
            });

            return productos;
        },

        tieneStockDisponible: function(codigo, cantidad){
            var obj = hash[codigo];
            return parseInt(obj.disponibles) >= parseInt(cantidad);
        }
    };
}

module.exports = mantieneRestanteService;
