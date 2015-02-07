function formatoRut(){
    return function(input){
        var rut, dv, str, i;

        rut = input.split('-');
        dv = rut[1];
        rut = rut[0];
        str = '';
        rut = rut.split('').reverse();

        for(i = 0; i < rut.length; i++){
            if(i !== 0 && i % 3 === 0){
                str += '.';
            }

            str += rut[i];
        }

        str = str.split('').reverse().join('') + '-' + dv;
        return str;
    };
}

function formatoPeso(){
    return function(input){
        if(!input){
            return '$0';
        }

        var aux = input.toString().split('').reverse(),
            str = [], i;

        for(i = 0; i < aux.length; i++){
            if(i !== 0 && i % 3 === 0){
                str.push('.');
            }

            str.push(aux[i]);
        }

        return '$' + str.reverse().join('');
    };
}

module.exports.formatoRut = formatoRut;
module.exports.formatoPeso = formatoPeso;
