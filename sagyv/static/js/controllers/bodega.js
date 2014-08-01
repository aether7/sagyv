App.Controllers.Bodega = function(){
    var tpl = $("#tpl_nuevo_producto").html();
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardar = $("#btn_guardar_guia");
    this.listaDespacho = $("#lista_despacho tbody");
    this.renderProducto = Handlebars.compile(tpl);
};

App.Controllers.Bodega.prototype = {
    constructor: App.Controllers.Bodega,

    init: function(){
        var _this = this;

        $("#bodega_tab a").on("click", function(evt){
            evt.preventDefault();
            $(this).tab("show");
        });

        $("#btn_guia_despacho").on("click", function(evt){
            common.mostrarModal("guia_despacho");
            _this.listaDespacho.empty();
        });

        this.btnAgregar.on("click", function(evt){
            _this.agregarProducto();
        });

        this.btnGuardar.on("click", function(evt){
            _this.guardar();
        });

        this.listaDespacho.on("click","i[data-accion=eliminar]", function(evt){
            evt.preventDefault();
            $(this).closest("tr").remove();
        });
    },

    agregarProducto: function(){
        var html,
            producto = $("#guia_producto"),
            cantidad = $("#cantidad_producto");

        html = this.renderProducto({
            id : producto.val(),
            cantidad : cantidad.val(),
            codigo : producto.find("option:selected").text().trim()
        });

        this.listaDespacho.append(html);
        cantidad.val("");
    },

    guardar: function(){
        var json,
            numero = $("#numero_despacho"),
            movil = $("#movil_despacho"),
            fecha = $("#fecha_despacho"),
            action = $("#f_guia_despacho").attr("action");

        if(!this.esValidaGuia(numero, movil, fecha)){
            return;
        }

        json = {
            numero : numero.val(),
            movil : movil.val(),
            fecha : fecha.val(),
            productos : []
        };

        this.listaDespacho.find("tr").each(function(){
            var id = $(this).data("id"),
                cantidad = $(this).data("cantidad");

            json.productos.push({
                id : id,
                cantidad : cantidad
            });
        });

        json.productos = JSON.stringify(json.productos);
        console.log(json);

        $.post(action, json, function(data){
            console.log(data);
        });
    },

    esValidaGuia: function(numero, movil, fecha){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(numero.val().trim() === ""){
            valido = false;
            numero.siblings("span").text("campo obligatorio");
            numero.parent().addClass("has-error");
        }

        if(movil.val() === ""){
            valido = false;
            movil.siblings("span").text("campo obligatorio");
            movil.parent().addClass("has-error");
        }

        if(fecha.val().trim() === ""){
            valido = false;
            fecha.siblings("span").text("campo obligatorio");
            fecha.parent().addClass("has-error");
        }

        if(!this.listaDespacho.find("tr").length){
            valido = false;
            $("#mensajes_lista_productos span").
                text("se debe agregar al menos 1 producto a la lista de productos").
                parent().addClass("has-error");
        }

        return valido;
    }
};
