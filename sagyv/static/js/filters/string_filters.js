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

module.exports.formatoRut = formatoRut;
