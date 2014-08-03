App.Controllers.Cliente = function(){
    this.btnAgregar = $("#btn_agregar");
    this.btnGuardarAdd = $("#btn_guardar_add");
    this.btnGuardarUpdate = $("#btn_guardar_update");
    this.listaClientes = $("#tabla_clientes tbody");
    this.rutList = [];
    this.idCliente = null;
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    addClienteRut: function(rut){
        this.rutList.push(rut);
    },

    init: function(){
        var _this = this;

        this.btnAgregar.on("click",function(){
            $("#nueva_situacion_add").addClass("hidden");
            common.mostrarModal("agregar");
        });

        this.btnGuardarAdd.on("click", function(){
            _this.guardarAdd();
        });

        this.btnGuardarUpdate.on("click", function(){
            _this.guardarUpdate();
        });

        this.listaClientes.on("click","a[data-accion=editar]",function(evt){
            evt.preventDefault();
            $("#nueva_situacion_update").addClass("hidden");
            common.mostrarModal("editar");
            _this.cargarCliente($(this).data("id"));
        });

        this.listaClientes.on("click","a[data-accion=eliminar]",function(evt){
            evt.preventDefault();
            _this.eliminarCliente($(this).data("id"));
        });

        $("#tabla_clientes").tablesorter();

        $("#sit_comercial_add").on("change",function(){
            if($(this).val() === "otro"){
                $("#nueva_situacion_add").removeClass("hidden");
            }else{
                $("#nueva_situacion_add").addClass("hidden");
            }
        });

        $("#sit_comercial_update").on("change", function(){
            if($(this).val() === "otro"){
                $("#nueva_situacion_update").removeClass("hidden");
            }else{
                $("#nueva_situacion_update").addClass("hidden");
            }
        });

        $("#f_buscar_cliente").on("submit", function(evt){
            evt.preventDefault();
            var busqueda = $("#cliente_busqueda").val(),
                action = $(this).attr("action");

            _this.buscarCliente(busqueda, action);
        });

    },

    buscarCliente: function(busqueda, action){
        var _this = this;

        $.get(action, { busqueda : busqueda }, function(data){
            var template = $("#tpl_nuevo_cliente").html(),
                fn = Handlebars.compile(template);

            _this.listaClientes.empty();

            data.forEach(function(cliente){
                _this.listaClientes.append(fn({
                    id : cliente.id,
                    nombre : cliente.nombre,
                    rut : cliente.rut,
                    direccion : cliente.direccion,
                    giro : cliente.giro,
                    situacion_comercial : cliente.situacion_comercial,
                    telefono : cliente.telefono
                }));
            });
        });
    },

    cargarCliente: function(id){
        var url = App.urls.get("cliente:obtener").replace("0", id);
        this.idCliente = id;

        $.get(url, function(data){
            $("#giro_update").val(data.giro);
            $("#nombre_update").val(data.nombre);
            $("#direccion_update").val(data.direccion);
            $("#telefono_update").val(data.telefono);
            $("#rut_update").val(data.rut);
            $("#sit_comercial_update").val(data.situacion_comercial);
            $("#obs_update").val(data.obs);

            if(data.credito){
                $("#credito_update").get(0).checked = true;
            }

            if(data.dispensador){
                $("#dispensador_update").get(0).checked = true;
            }
        });
    },

    eliminarCliente: function(id){
        var _this = this,
            url = App.urls.get("cliente:eliminar");

        this.id = id;

        if(!confirm("Esta acción eliminará al cliente, ¿ desea continuar ?")){
            return;
        }

        $.post(url, { id_cliente : id }, function(data){
            var rut = $("#tabla_clientes tbody tr[data-id={0}] td[data-columna=rut]".format(id));

            if(_.indexOf(_this.rutList, rut) !== -1){
                _this.rutList = _.without(_this.rutList, rut);
            }

            $("a[data-id={0}][data-accion=editar]".format(id)).closest("tr").remove();
        });
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
            dispensador = $("#dispensador_add"),
            observaciones = $("#obs_add"),
            cantidad = $("#numero_add"),
            valido = true,
            _this = this;

        valido = this.validarCampos(nombre, giro, direccion, telefono, rut, cantidad);

        if(!valido){
            return;
        }else if(_.indexOf(this.rutList, rut.val()) !== -1){
            rut.siblings("span").text("El rut ya está siendo utilizado");
            rut.parent().addClass("has-error");
            return;
        }

        json = {
            nombre : nombre.val(),
            giro : giro.val(),
            direccion : direccion.val(),
            telefono : telefono.val(),
            rut : rut.val(),
            situacion_comercial : sitComercial.val(),
            credito : credito.is(":checked"),
            dispensador : dispensador.is(":checked"),
            cantidad : cantidad.val().replace(/[\.,]/g, ""),
            tipo : $("#tipo_add").val(),
            producto : $("#sel_producto_add").val(),
            obs : observaciones.val().trim()
        };

        $.post($("#f_agregar_cliente").attr("action"), json, function(data){
            json.id = data.id;
            _this.rutList.push(rut.val());

            $("#modal_agregar").modal("hide");
            _this.procesarAgregar(data);
            common.agregarMensaje("El cliente fue ingresado exitosamente");

            if( $("#numero_add").val() != '' ){
                var str = "<option value='{0}'>{1}</option>";
                str = str.format(data.situacion_comercial.id, data.situacion_comercial.texto);
                $(str).insertBefore("#sit_comercial_add option:last");
                $(str).insertBefore("#sit_comercial_update option:last");
            }
        });
    },

    procesarAgregar: function(data){
        var html,
            situacionComercial,
            template = $("#tpl_nuevo_cliente").html(),
            render = Handlebars.compile(template);

        if(data.situacion_comercial == 1){
            situacionComercial = "Sin descuento";
        }else{
            situacionComercial = data.situacion_comercial;
        }

        html = render({
            nombre : data.nombre,
            giro : data.giro,
            rut : data.rut,
            situacion_comercial : data.situacion_comercial.texto,
            telefono : data.telefono,
            direccion : data.direccion,
            id : data.id
        });

        $("#tabla_clientes tbody").append(html);
    },

    guardarUpdate: function(){
        var json,
            nombre = $("#nombre_update"),
            giro = $("#giro_update"),
            direccion = $("#direccion_update"),
            telefono = $("#telefono_update"),
            rut = $("#rut_update"),
            sitComercial = $("#sit_comercial_update"),
            credito = $("#credito_update"),
            dispensador = $("#dispensador_update"),
            observaciones = $("#obs_update"),
            cantidad = $("#numero_update"),
            valido = true,
            _this = this;

        valido = this.validarCampos(nombre, giro, direccion, telefono, rut, cantidad);

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
            credito : credito.is(":checked"),
            dispensador : dispensador.is(":checked"),
            id_cliente : this.idCliente,
            obs : observaciones.val().trim(),
            cantidad : cantidad.val().replace(/[\.,]/g, ""),
            tipo : $("#tipo_update").val(),
            producto : $("#sel_producto_update").val()
        };

        $.post($("#f_editar_cliente").attr("action"), json, function(data){
            $("#modal_editar").modal("hide");
            common.agregarMensaje("El cliente fue actualizado exitosamente");

            var tr = $("a[data-id={0}][data-accion=editar]".format(_this.idCliente)).closest("tr");

            tr.find("[data-columna=nombre]").text(data.nombre);
            tr.find("[data-columna=giro]").text(data.giro);
            tr.find("[data-columna=telefono]").text(data.telefono);
            tr.find("[data-columna=direccion]").text(data.direccion);
            tr.find("[data-columna=situacion_comercial]").text(data.situacion_comercial);
        });
    },

    validarCampos: function(nombre, giro, direccion, telefono, rut, cantidad){
        var valido = true;

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        if(nombre.val() === ""){
            valido = false;
            nombre.siblings("span").text("campo obligatorio");
            nombre.parent().addClass("has-error");
        }else if(!/^[A-záéíóúñÁÉÍÓÚÑ\s]+$/i.test(nombre.val())){
            valido = false;
            nombre.siblings("span").text("El nombre no es válido");
            nombre.parent().addClass("has-error");
        }

        if(giro.val().trim() === ""){
            valido = false;
            giro.siblings("span").text("campo obligatorio");
            giro.parent().addClass("has-error");
        }

        if(direccion.val().trim() === ""){
            valido = false;
            direccion.siblings("span").text("campo obligatorio");
            direccion.parent().addClass("has-error");
        }else if(/^\d+$/.test(direccion.val())){
            valido = false;
            direccion.siblings("span").text("el formato de la dirección no es válido");
            direccion.parent().addClass("has-error");
        }

        if(telefono.val().trim() !== "" && !/^\d+$/i.test(telefono.val())){
            valido = false;
            telefono.siblings("span").text("Debe ingresar número de teléfono válido");
            telefono.parent().addClass("has-error");
        }

        if(rut.val().trim() === ""){
            valido = false;
            rut.siblings("span").text("campo obligatorio");
            rut.parent().addClass("has-error");
        }else if(!$.Rut.validar(rut.val())){
            valido = false;
            rut.siblings("span").text("El rut es incorrecto");
            rut.parent().addClass("has-error");
        }

        if(cantidad.val() !== "" && !/^\d+$/.test(cantidad.val())){
            valido = false;
            cantidad.siblings("span").text("solo deben ingresarse números");
            cantidad.parent().addClass("has-error");
        }

        return valido;
    }
};
