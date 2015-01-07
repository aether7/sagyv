App.Controllers.SituacionComercial = function(){
    this.situacionComercialList = [];
    this.idSituacion = null;
    this.situacionComercial = null;
};

App.Controllers.SituacionComercial.prototype = {
    constructor: App.Controllers.SituacionComercial,

    guardarSituacion: function(monto, tipo, producto){
        var json, action, situacionComercial;

        situacionComercial = new App.Models.SituacionComercial();
        situacionComercial.monto = monto;
        situacionComercial.tipo = tipo;
        situacionComercial.producto = producto;

        if(!situacionComercial.esValido()){
            pubsub.publish("sitComercial:noValido", [ situacionComercial.getErrorList() ]);
            return;
        }else if(this.existeSituacionDuplicada(tipo, monto, producto)){
            alert("Esta situación comercial ya ha sido ingresada anteriormente");
            return;
        }

        json = situacionComercial.getJSON();
        action = App.urls.get("clientes:crear_situacion_comercial");

        $.post(action, json, function(data){
            pubsub.publish("sitComercial:procesarCrear",[ data ]);
        });
    },

    cargarSituacion: function(id){
        var url = App.urls.get("clientes:obtener_situacion_comercial") + '?id=' + id;
        this.idSituacion = id;

        $.get(url, function(data){
            pubsub.publish("sitComercial:cargarDatosEdicion",[ data ]);
        });
    },

    guardarUpdateSituacion:function(monto, tipo, producto, id){
        var json, url, situacionComercial;

        situacionComercial = new App.Models.SituacionComercial();
        situacionComercial.id = id;
        situacionComercial.monto = monto;
        situacionComercial.tipo = tipo;
        situacionComercial.producto = producto;

        if(!situacionComercial.esValido()){
            pubsub.publish("sitComercial:noValido", [ situacionComercial.getErrorList() ]);
            return;
        }

        url = App.urls.get("clientes:modificar_situacion_comercial");
        json = situacionComercial.getJSON();

        $.post(url, json, function(data){
            pubsub.publish("sitComercial:procesarActualizar", [ data ]);
        });
    },

    addSituacionComercial: function(tipoDescuento, monto, producto){
        this.situacionComercialList.push({
            tipoDescuentoId : tipoDescuento,
            monto : monto,
            productoId : producto
        });
    },

    existeSituacionDuplicada: function(tipoDescuento, monto, producto){
        var duplicado = false,
            tipoDescuento = parseInt(tipoDescuento),
            monto = parseInt(monto),
            producto = parseInt(producto);

        this.situacionComercialList.forEach(function(sc){
            if(sc.tipoDescuentoId === tipoDescuento &&
                sc.monto === monto && sc.productoId === producto){
                duplicado = true;
            }
        });

        return duplicado;
    }
};
