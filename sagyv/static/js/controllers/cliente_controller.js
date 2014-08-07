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

    buscarCliente: function(busqueda, action){
        var _this = this;

        $.get(action, { busqueda: busqueda }, function(data){
            pubsub.publish("cliente:buscar", [ data ]);
        });
    },

    cargarCliente: function(id){
        var url = App.urls.get("cliente:obtener").replace("0", id),
            _this = this;
        
        _this.idCliente = id;
        $.get(url, function(data){
            pubsub.publish("cliente:cargarCliente", [ data ]);
        });
    },

    eliminarCliente: function(id){
        var _this = this,
            url = App.urls.get("cliente:eliminar");

        $.post(url, { id_cliente : id }, function(data){
            pubsub.publish("cliente:removerCliente",[ data ]);

            rut = data.rut;

            if(_.indexOf(_this.rutList, rut) !== -1){
                _this.rutList = _.without(_this.rutList, rut);
            }
        });
    },

    guardarAdd: function(data){
        var url,
            cliente = new App.Models.Cliente(),
            data = Object.create(data),
            _this = this;

        console.log(_this);

        cliente.nombre = data.nombre;
        cliente.giro = data.giro;
        cliente.direccion = data.direccion;
        cliente.telefono = data.telefono;
        cliente.rut = data.rut;
        cliente.situacionComercial = data.situacionComercial;
        cliente.credito = data.credito;
        cliente.dispensador = data.dispensador;
        cliente.observacion = data.observacion;
        cliente.cantidad = data.cantidad;
        cliente.tipo = data.tipo;
        cliente.producto = data.producto;

        if(!cliente.esValido()){
            pubsub.publish("cliente:noValido", [ cliente.getErrorList() ]);
            return;
        }

        url = App.urls.get("cliente:crear");
        json = cliente.getJSON();

        $.post(url, json, function(data){
            pubsub.publish("cliente:procesarCrear", [ data ]);
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

    guardarUpdate: function(data){
        var url,
            cliente = new App.Models.Cliente(),
            data = Object.create(data),
            _this = this;

        cliente.nombre = data.nombre;
        cliente.giro = data.giro;
        cliente.direccion = data.direccion;
        cliente.telefono = data.telefono;
        cliente.rut = data.rut;
        cliente.situacionComercial = data.situacionComercial;
        cliente.credito = data.credito;
        cliente.dispensador = data.dispensador;
        cliente.observacion = data.observacion;
        cliente.cantidad = data.cantidad;
        cliente.tipo = data.tipo;
        cliente.producto = data.producto;
        cliente.idCliente = _this.idCliente;

        if(!cliente.esValido()){
            pubsub.publish("cliente:noValido", [ cliente.getErrorList() ]);
            return;
        }

        url = App.urls.get("cliente:update");
        json = cliente.getJSON();

        $.post(url, json, function(data){
            console.log(data);
            pubsub.publish("cliente:actualizarCliente", [ data ]);
        });

        /*console.log(data);
        var valido = true,
            //sels = this.obtenerSelectores("update"),
            _this = this;

        return;

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
        });*/
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
