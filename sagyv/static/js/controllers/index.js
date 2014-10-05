App.Controllers.Index = function(){
    this.form = $("#f_login");
    this.usuario = $("#usuario");
    this.clave = $("#clave");
    this.init();
};

App.Controllers.Index.prototype = {
    constructor: App.Controllers.Index,
    init: function(){
        this.form.on("submit",this.validate());
    },

    validate: function(){
        var _this = this;

        return function(evt){
            evt.preventDefault();
            var valido = true;

            $(".help-block").text("");
            $(".has-error").removeClass("has-error");

            if(_this.usuario.val().trim() === ""){
                valido = false;
                _this.usuario.parent().addClass("has-error");
                _this.usuario.siblings("span").text("Campo obligatorio");
            }

            if(_this.clave.val().trim() === ""){
                valido = false;
                _this.clave.parent().addClass("has-error");
                _this.clave.siblings("span").text("Campo obligatorio");
            }

            if(valido){
                var json = {
                    usuario: _this.usuario.val(),
                    clave: _this.clave.val()
                };

                $.post($(this).attr("action"),json,_this.processResponse);
            }
        };
    },

    processResponse: function(data){
        $("#mensaje").removeClass("alert-success alert-danger");

        switch(data.status){
        case "ok":
            $("#mensaje").text(data.message).addClass("alert-success");
            setTimeout(function(){
                window.location.href = data.redirect;
            },1500);
            break;
        case "error":
            $("#mensaje").text(data.message).addClass("alert-danger");
            break;
        default:
            alert("ERROR al recibir información desde el servidor");
        }
    }
};
