App.Controllers.Bodega = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardar = $("#btn_guardar_guia");
    this.listaDespacho = $("#lista_despacho tbody");
    this.renderProducto = Handlebars.compile($("#tpl_nuevo_producto").html());
    this.renderVerDetalleProducto = Handlebars.compile($("#tpl_ver_detalle").html());
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

        $("#lista_productos_transito").on("click","a[data-accion=ver_detalle]", function(evt){
            evt.preventDefault();

            var id = $(this).data("productoId"),
                url = App.urls.get("bodega:obtener_vehiculos_por_producto"),
                modalBody = $("#modal_ver_detalle .modal-body");

            modalBody.empty();

            $.get(url, { producto_id : id }, function(data){
                var html,
                    dato = { resultados : data };

                html = _this.renderVerDetalleProducto(dato);
                modalBody.html(html);
                common.mostrarModal("ver_detalle");
            });
        });
    },

    agregarProducto: function(){
        var html,
            producto = $("#guia_producto"),
            cantidad = $("#cantidad_producto"),
            codigo = producto.find("option:selected").text().trim();

        if(this.listaDespacho.find("tr[data-id={0}]".format(producto.val())).length){
            alert("EL producto {0} ya fue ingresado, revise nuevamente".format(codigo));
            return;
        }

        html = this.renderProducto({
            id : producto.val(),
            cantidad : cantidad.val(),
            codigo : codigo
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
        $.post(action, json, this.procesarGuiaSalida);
    },

    procesarGuiaSalida: function(data){
        data.productos.forEach(function(producto){
            var stock = $("#stock_{0}".format(producto.id));

            stock.text(producto.cantidad);

            if(producto.cantidad < 10){
                stock.addClass("text-danger");
            }else{
                stock.removeClass("text-danger");
            }
        });

        $("#modal_guia_despacho").modal("hide");
        common.agregarMensaje("Se ha creado la nueva guía exitosamente");
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
