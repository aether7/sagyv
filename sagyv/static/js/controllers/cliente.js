App.Controllers.Cliente = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardarAdd = $("#btn_guardar_add");
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    init: function(){
        var _this = this;

        this.btnAgregar.on("click",function(){
            _this.mostrarModal("agregar");
        });

        this.btnGuardarAdd.on("click", function(){
            _this.guardarAdd();
        });
    },

    mostrarModal: function(id){
        var $modal = $("#modal_" + id);
        $modal.modal("show");
        $modal.find("form").get(0).reset();
        $(".has-error").removeClass("has-error");
        $(".help-block").text("");
    },

    guardarAdd: function(){
        var json,
            nombre = $("#nombre_add"),
            giro = $("#giro_add"),
            direccion = $("#direccion_add"),
            telefono = $("#telefono_add"),
            rut = $("#rut_add"),
            sitComercial = $("#sit_comercial_add"),
            credito = $("#credito_add"),
            valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(nombre.val().trim() === ""){
            valido = false;
            nombre.siblings("span").text("Campo obligatorio");
            nombre.parent().addClass("has-error");
        }

        if(giro.val().trim() === ""){
            valido = false;
            giro.siblings("span").text("Campo obligatorio");
            giro.parent().addClass("has-error");
        }

        if(direccion.val().trim() === ""){
            valido = false;
            direccion.siblings("span").text("Campo obligatorio");
            direccion.parent().addClass("has-error");
        }

        if(telefono.val().trim() === ""){
            valido = false;
            telefono.siblings("span").text("Campo obligatorio");
            telefono.parent().addClass("has-error");
        }

        if(rut.val().trim() === ""){
            valido = false;
            rut.siblings("span").text("Campo obligatorio");
            rut.parent().addClass("has-error");
        }

        if(sitComercial.val() === ""){
            valido = false;
            sitComercial.siblings("span").text("Campo obligatorio");
            sitComercial.parent().addClass("has-error");
        }

        if(!valido){
            return;
        }

        json = {
            nombre : nombre.val(),
            giro : giro.val(),
            direccion : direccion.val(),
            telefono : telefono.val(),
            rut : rut.val(),
            situacion_comercial : sitComercial.val(),
            credito : credito.is(":checked")
        };

        $.post($("#f_crear_cliente").attr("action"), json, function(data){
            console.log(data);
        });
    }
};
