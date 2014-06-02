var App = {};
App.Controllers = {};
App.Models = {};
App.cookies = {};

(function(){
    document.cookie.split(";").forEach(function(token){
        var tokens = token.split("=");
        App.cookies[tokens[0]] = tokens[1];
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
