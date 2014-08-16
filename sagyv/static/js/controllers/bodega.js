App.Controllers.Bodega = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnAgregarCarga = $("#btn_agregar_carga");
    this.btnGuardar = $("#btn_guardar_guia");
    this.btnGuardarCarga = $("#btn_guardar_carga_producto");
    this.listaDespacho = $("#lista_despacho tbody");
    this.listaCargaDespacho = $("#lista_carga tbody");
    this.renderProducto = Handlebars.compile($("#tpl_nuevo_producto").html());
    this.renderCargaProducto = Handlebars.compile($("#tpl_carga_producto").html());
    this.renderVerDetalleProducto = Handlebars.compile($("#tpl_ver_detalle").html());
    this.renderVerDetalleGuia = Handlebars.compile($("#tpl_carga_guia").html());

    /*Datos Guia*/
    this.renderProductoDespacho = Handlebars.compile($("#tpl_despacho_producto").html());
    this.despacho = $("#despacho tbody");
    this.btnAgregarRecarga = $("#btn_agregar_recarga");
    this.listaRecarga = $("#lista_despacho_recarga tbody");
    this.btnGuardarRecarga = $("#btn_guardar_recarga");
    this.idGuiaDespacho = null;
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

        $("#btn_guia_cargar_producto").on("click", function(evt){
            common.mostrarModal("carga_producto");
            _this.listaDespacho.empty();
        });

        this.btnAgregar.on("click", function(evt){
            _this.agregarProducto();
        });

        this.btnAgregarRecarga.on("click", function(evt){
            _this.agregarProductoRecarga();
        });

        this.btnAgregarCarga.on("click", function(evt){
            _this.agregarCargaProducto();
        });

        this.btnGuardar.on("click", function(evt){
            _this.guardar();
        });

        this.btnGuardarRecarga.on("click", function(evt){
            _this.guardarRecarga();
        });

        this.btnGuardarCarga.on("click", function(evt){
            _this.guardarCargaProducto();
        });

        this.listaDespacho.on("click","i[data-accion=eliminar]", function(evt){
            evt.preventDefault();
            $(this).closest("tr").remove();
        });

        this.listaRecarga.on("click","i[data-accion=eliminar]", function(evt){
            evt.preventDefault();
            $(this).closest("tr").remove();
        });

        this.listaCargaDespacho.on("click", "i[data-accion=eliminar_carga]", function(evt){
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

        /*Codigo Guias*/
        $("#tbl_guias").on("click", "a[data-accion=mostrar_detalle]", function(evt){
            evt.preventDefault();
            var id = $(this).data("guiaid"),
                url = App.urls.get("bodega:obtener_guia"),
                modalBody = $("#modal_mostrar_guia .modal-body");

            modalBody.empty();

            $.get(url, {guia_id : id}, function(data){
                var html,
                    dato = { resultados: data.productos };

                html = _this.renderVerDetalleGuia(dato);
                modalBody.html(html);
                common.mostrarModal('mostrar_guia');
            });
        });

        $("#tbl_guias").on("click", "a[data-accion=recargar_guia]", function(evt){
            evt.preventDefault();
            var id = $(this).data("guiaid"),
                url = App.urls.get("bodega:obtener_guia");

            _this.idGuiaDespacho = id;
            _this.despacho.text('');
            $.get(url, {guia_id : id}, function(data){
                $("#numero_despacho_rec").text(data.numero_guia);
                $("#movil_despasho_rec").text(data.movil);
                $("#fecha_despacho_rec").text(data.fecha);

                data.productos.forEach(function(producto){
                    html = _this.renderProductoDespacho({
                        id : producto.id_producto,
                        cantidad : producto.cantidad,
                        codigo : producto.codigo
                    });

                    _this.despacho.append(html);
                });

            });
            common.mostrarModal('recargar_guia');
        });
    },

    guardarRecarga: function(){
        $("#mensajes_lista_productos_recarga span").text("").parent().removeClass("has-error");
        url = App.urls.get("bodega:recargar_guia");

        json = {
            id_guia : this.idGuiaDespacho,
            productos : []
        };

        if(!this.listaRecarga.find("tr").length){
            $("#mensajes_lista_productos_recarga span").
                text("se debe agregar al menos 1 producto a la lista de productos").
                parent().addClass("has-error");
            return;
        }

        this.listaRecarga.find("tr").each(function(){
            var id = $(this).data("id"),
                cantidad = $(this).data("cantidad");

            json.productos.push({
                id_producto : id,
                cantidad : cantidad
            });
        });

        json.productos = JSON.stringify(json.productos);

        $.post(url, json, function(data){
            console.log(data);
        });
    },

    agregarProductoRecarga: function(){
        var html,
            producto = $("#guia_producto_recarga"),
            cantidad = $("#cantidad_producto_recarga"),
            codigo = producto.find("option:selected").text().trim();

        if(!this.listaRecarga.find("tr[data-id={0}]".format(producto.val()).length)){
            alert("EL producto {0} ya fue ingresado, revise nuevamente".format(codigo));
            return;
        }

        html = this.renderProducto({
            id : producto.val(),
            cantidad : cantidad.val(),
            codigo : codigo
        });

        this.listaRecarga.append(html);
        cantidad.val('');

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
    },

    guardarCargaProducto: function(){
        var json,
            factura = $("#factura"),
            fecha = $("#fecha_ingreso"),
            precio = $("#valor_total")
            action = $("#f_carga_producto").attr("action");

        if(!this.esValidaCargaProducto(factura, fecha, precio)){
            return;
        }

        json = {
            factura : factura.val(),
            fecha : fecha.val(),
            productos : []
        };

        this.listaCargaDespacho.find("tr").each(function(){
            var id = $(this).data("id"),
                cantidad = $(this).data("cantidad");

            json.productos.push({
                id : id,
                cantidad : cantidad
            });
        });

        json.productos = JSON.stringify(json.productos);
        $.post(action, json, function(data){
            data.productos.forEach(function(producto){
                var stock = $("#stock_{0}".format(producto.id));
                stock.text(producto.cantidad);
            });
            $("#modal_carga_producto").modal("hide");
            common.agregarMensaje("Se han cagado los productos exitosamente");
        });
    },

    agregarCargaProducto: function(){
        var html,
            producto = $("#guia_carga_producto"),
            cantidad = $("#cantidad_carga_producto"),
            precio = producto.find("option:selected").data("precio"),
            codigo = producto.find("option:selected").text().trim(),
            total = cantidad.val() * precio;

        if(this.listaCargaDespacho.find("tr[data-id={0}]".format(producto.val())).length){
            alert("EL producto {0} ya fue ingresado, revise nuevamente".format(codigo));
            return;
        }

        html = this.renderCargaProducto({
            id : producto.val(),
            cantidad : cantidad.val(),
            codigo : codigo,
            precio : total
        });

        this.listaCargaDespacho.append(html);
        cantidad.val("");
    },

    procesarCarga: function(data){
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

    esValidaCargaProducto: function(factura, fecha, precio){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(factura.val().trim() === ""){
            valido = false;
            factura.siblings("span").text("campo obligatorio");
            factura.parent().addClass("has-error");
        }else if(isNaN(factura.val().trim())){
            valido = false;
            factura.siblings("span").text("deben ser solo numeros");
            factura.parent().addClass("has-error");
        }

        if(fecha.val().trim() === ""){
            valido = false;
            fecha.siblings("span").text("campo obligatorio");
            fecha.parent().addClass("has-error");
        }

        if(precio.val().trim() === ""){
            valido = false;
            precio.siblings("span").text("campo obligatorio");
            precio.parent().addClass("has-error");
        }else if(isNaN(precio.val())){
            valido = false;
            factura.siblings("span").text("deben ser solo numeros");
            factura.parent().addClass("has-error");
        }

        if(!this.listaCargaDespacho.find("tr").length){
            valido = false;
            $("#mensajes_carga_lista_productos span").
                text("se debe agregar al menos 1 producto a la lista de productos").
                parent().addClass("has-error");
        }else{
            valido = true;
            $("#mensajes_carga_lista_productos span").
                text("").
                parent().removeClass("has-error");
        }

        return valido;
    }
};
