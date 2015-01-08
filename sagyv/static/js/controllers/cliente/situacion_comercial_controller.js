var SituacionComercial = require('../../models/cliente/situacion_comercial_model.js');

function SituacionComercialController(service, rootScope){
    this.scope = rootScope;
    this.service = service;
    this.index = null;
    this.situacionComercial = new SituacionComercial();
    this.init();
}

SituacionComercialController.prototype = {
    constructor: SituacionComercialController,

    init: function(){
        var _this = this;

        this.service.all(function(data){
            _this.scope.situacionesComerciales = data.map(function(d){
                var situacionComercial = new SituacionComercial();

                situacionComercial.id = d.id;
                situacionComercial.monto = d.monto;
                situacionComercial.producto = d.producto;
                situacionComercial.tipoDescuento = d.tipoDescuento;

                return situacionComercial;
            });
        });
    },

    nueva: function(){
        this.situacionComercial = new SituacionComercial();
        $('#modal_agregar_situacion').modal('show');
    },

    editar: function(index){
        this.index = index;
        this.situacionComercial = this.scope.situacionesComerciales[index];
        $('#modal_editar_situacion').modal('show');
    },

    eliminar: function(index){

    },

    crear: function(){
        if(!this.situacionComercial.esValido()){
            return;
        }

        var optProducto = $('#sit_producto_add option:selected'),
            tipoDesc = $('#sit_tipo_add option:selected');

        this.situacionComercial.tipoDescuento.tipo = tipoDesc.text();
        this.situacionComercial.producto.codigo = optProducto.data('codigo');
        this.situacionComercial.producto.nombre = optProducto.data('nombre');

        this.service.create(this.situacionComercial.toJSON(), this.procesarCrear.bind(this));
    },

    procesarCrear: function(data){
        this.situacionComercial.id = data.id;
        this.scope.situacionesComerciales.push(this.situacionComercial);
        $('#modal_agregar_situacion').modal('hide');
        common.agregarMensaje('La situación comercial fue creada exitosamente');
    },

    actualizar: function(){
        if(!this.situacionComercial.esValido()){
            return;
        }

        this.service.update(this.situacionComercial.toJSON(), this.procesarActualizar.bind(this));
    },

    procesarActualizar: function(data){
        this.scope.situacionesComerciales[this.index] = this.situacionComercial;
        $('#modal_editar_situacion').modal('hide');
        common.agregarMensaje('La situación comercial fue editada exitosamente');
    }
};

module.exports = SituacionComercialController;
