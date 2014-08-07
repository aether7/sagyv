App.Controllers.Cliente = function(){
    this.rutList = [];
    this.idCliente = null;
    this.cliente = null;
};

App.Controllers.Cliente.prototype = {
    constructor: App.Controllers.Cliente,

    addClienteRut: function(rut){
        this.rutList.push(rut);
    },

    init: function(){
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
            common.agregarMensaje("Se ha eliminado al cliente exitosamente");
        });
    },

    guardarAdd: function(data){
        var cliente = new App.Models.Cliente();

        cliente.nombre = data.nombre;
        cliente.giro = data.giro;
        cliente.direccion = data.direccion;
        cliente.telefono = data.telefono;
        cliente.rut = data.rut;
        cliente.sitacionComercial = data.sitacionComercial;
        cliente.credito = data.credito;
        cliente.dispensador = data.dispensador;
        cliente.observacion = data.observacion;

        if(!cliente.esValido()){
            pubsub.publish("cliente:esValido", cliente.getErrorList());
            return;
        }
        /*var cliente,
            sels = this.obtenerSelectores("add");
            valido = true,
            _this = this;

        cliente = this.setearCliente(sels);

        valido = this.validarCampos(cliente, sels.nombre, sels.giro,
            sels.direccion, sels.telefono, sels.rut, sels.cantidad);

        if(!valido){
            return;
        }else if(_.indexOf(this.rutList, sels.rut.val()) !== -1){
            sels.rut.siblings("span").text("El rut ya está siendo utilizado");
            sels.rut.parent().addClass("has-error");
            return;
        }

        $.post($("#f_agregar_cliente").attr("action"), cliente.getJSON(), function(data){
            _this.rutList.push(sels.rut.val());

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
        */
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
        var valido = true,
            sels = this.obtenerSelectores("update"),
            _this = this;

        cliente = this.setearCliente(sels);
        cliente.idCliente = this.idCliente;

        valido = this.validarCampos(cliente, sels.nombre, sels.giro,
            sels.direccion, sels.telefono, sels.rut, sels.cantidad);

        if(!valido){
            return;
        }

        $.post($("#f_editar_cliente").attr("action"), cliente.getJSON(), function(data){
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

    validarCampos: function(cliente, nombre, giro, direccion, telefono, rut, cantidad){
        var sels,
            valido = true;

        sels = {
            nombre : nombre,
            giro : giro,
            direccion : direccion,
            telefono : telefono,
            rut : rut,
            cantidad: cantidad
        };

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");

        valido = cliente.esValido();

        if(!valido){
            common.mostrarErroresVista(sels, cliente.getErrorList());
        }

        return valido;
    },

    obtenerSelectores: function(opcion){
        return {
            nombre : $("#nombre_" + opcion),
            giro : $("#giro_" + opcion),
            direccion : $("#direccion_" + opcion),
            telefono : $("#telefono_" + opcion),
            rut : $("#rut_" + opcion),
            sitComercial : $("#sit_comercial_" + opcion),
            credito : $("#credito_" + opcion),
            dispensador : $("#dispensador_" + opcion),
            observaciones : $("#obs_" + opcion),
            cantidad : $("#numero_" + opcion),
            tipo : $("#tipo_" + opcion),
            producto : $("#sel_producto_" + opcion)
        };
    },

    setearCliente: function(sels){
        var cliente = new App.Models.Cliente();

        cliente.nombre = sels.nombre.val();
        cliente.giro = sels.giro.val();
        cliente.direccion = sels.direccion.val();
        cliente.telefono = sels.telefono.val();
        cliente.rut = sels.rut.val();
        cliente.situacionComercial = sels.sitComercial.val();
        cliente.credito = sels.credito.is(":checked");
        cliente.dispensador = sels.dispensador.is(":checked");
        cliente.cantidad = sels.cantidad.val();
        cliente.tipo = sels.tipo.val();
        cliente.producto = sels.producto.val();
        cliente.observacion = sels.observaciones.val();

        return cliente;
    }
};
