function standardError(data){
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

function URLMaker(){
    this.url = null;
}

URLMaker.prototype.withThis = function(url){
    this.url = url;
};

URLMaker.prototype.doQuery = function(obj){
    var queryStr = [];

    Objects.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    this.url += '?' + queryStr.join('&');
    return this.url;
};

exports.standardError = standardError;
exports.processURL = processURL;
