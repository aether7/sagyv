function standardError(data){
    console.error(data);
    alert('ha ocurrido un error en el servidor !!!');
};

function processURL(url, params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    url += '?' + queryStr.join('&');
    return url;
};

exports.standardError = standardError;
exports.processURL = processURL;
