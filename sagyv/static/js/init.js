var App = {};
App.Controllers = {};
App.Models = {};
App.cookies = {};

//se crea funcionalidad para urls
App.urls = (function(){
    function URLError(mensaje){
        this.name = "URL";
        this.message = mensaje;
    }

    var urls = {};

    return {
        set:function(urlLabel, urlLocation, urlParams){
            urls[urlLabel] = urlLocation;
        },

        get: function(urlLabel){
            var mje = "La etiqueta {0} no se encuentra, estas son las disponibles: {1}";

            if(urlLabel in urls){
                return urls[urlLabel];
            }else{
                throw new URLError(mje.format(urlLabel, Object.keys(urls).join(",")));
            }
        }
    }
})();

// procesamos las cookies que hayan en el sistema
(function(){
    document.cookie.split(";").forEach(function(token){
        var tokens = token.split("=");
        App.cookies[tokens[0].trim()] = tokens[1];
    });

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if(settings.type !== "POST"){
                return;
            }

            xhr.setRequestHeader("X-CSRFToken", App.cookies.andreacsrftoken);
        }
    });
})();

//se agrega funcionalidad type para ver tipos de variables
(function(context){
"use strict";

var paramTypes = [
    "Null", "Undefined", "Array",
    "Object", "Number", "Boolean",
    "RegExp", "Function", "Element",
    "NaN", "Infinity", "Date"
];

function type(obj){
    var str = {}.toString.call(obj),
        argType = str.match(/\[object (\w*?)\]/)[1].toLowerCase();

    if(obj && (obj.nodeType === 1 || obj.nodeType === 9)){
        return "element";
    }

    if(argType === "number"){
        if(isNaN(obj)){
            return "nan";
        }else if(!isFinite(obj)){
            return "infinity";
        }
    }

    return argType;
}

for(var i = 0; i < paramTypes.length; i++){
    type["is" + paramTypes[i]] = (function(i){
        return function(obj){
            return type(obj) === paramTypes[i].toLowerCase();
        };
    })(i);
}

context.type = type;
})(window);


//se agregan metodos nuevos a string
(function(){
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/gi, "");
};

String.prototype.format = function(){
    var args = Array.prototype.slice.apply(arguments),
        s = this,
        i = 0;

    for(i = 0;i < args.length; i++){
        s = s.replace(new RegExp("\\{\\s?" + i + "\s?\\}","g"),args[i]);
    }

    return s;
};
})();
