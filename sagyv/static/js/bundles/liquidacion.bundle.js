(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/liquidacion_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('liquidacionApp',[]),
    PanelBusquedaController = require('../controllers/liquidacion/panel_busqueda_controller.js'),
    LiquidacionController = require('../controllers/liquidacion/liquidacion_controller.js'),
    ProductoController = require('../controllers/liquidacion/producto_controller.js'),
    GuiaPropiaController = require('../controllers/liquidacion/guia_propia_controller.js'),
    GuiaLipigasController = require('../controllers/liquidacion/guia_lipigas_controller.js'),
    VoucherLipigasController = require('../controllers/liquidacion/voucher_lipigas_controller.js'),
    VoucherTransbankController = require('../controllers/liquidacion/voucher_transbank_controller.js'),
    ChequeController = require('../controllers/liquidacion/cheque_controller.js'),
    CuponPrepagoController = require('../controllers/liquidacion/cupon_prepago_controller.js'),
    OtroController = require('../controllers/liquidacion/otro_controller.js'),
    liquidacionService = require('../services/liquidacion_service.js');

app.factory('liquidacionService', liquidacionService);

app.controller('PanelBusquedaController', ['$scope', 'liquidacionService', PanelBusquedaController]);
app.controller('LiquidacionController', ['$scope', 'liquidacionService', LiquidacionController]);
app.controller('ProductoController', ['$scope', ProductoController]);
app.controller('GuiaPropiaController', ['$scope', 'liquidacionService', GuiaPropiaController]);
app.controller('GuiaLipigasController', ['$scope', 'liquidacionService', GuiaLipigasController]);
app.controller('VoucherLipigasController', ['$scope', VoucherLipigasController]);
app.controller('VoucherTransbankController', ['$scope', VoucherTransbankController]);
app.controller('ChequeController', ['$scope', ChequeController]);
app.controller('CuponPrepagoController', ['$scope', CuponPrepagoController]);
app.controller('OtroController', ['$scope', OtroController]);

})();

$('button[data-accion=abre_modal]').on('click', function(evt){
    $('#modal_' + $(this).data('modal')).modal('show');
});

},{"../controllers/liquidacion/cheque_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cheque_controller.js","../controllers/liquidacion/cupon_prepago_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cupon_prepago_controller.js","../controllers/liquidacion/guia_lipigas_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_lipigas_controller.js","../controllers/liquidacion/guia_propia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js","../controllers/liquidacion/liquidacion_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js","../controllers/liquidacion/otro_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/otro_controller.js","../controllers/liquidacion/panel_busqueda_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/panel_busqueda_controller.js","../controllers/liquidacion/producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js","../controllers/liquidacion/voucher_lipigas_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_lipigas_controller.js","../controllers/liquidacion/voucher_transbank_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_transbank_controller.js","../services/liquidacion_service.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/liquidacion_service.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cheque_controller.js":[function(require,module,exports){
var Cheque = require('./../../models/liquidacion/cheque_model.js');

function ChequeController($scope){
    this.scope = $scope;
    this.cheque = null;
    this.mensajes = {};
}

ChequeController.mixin({
    resetearCheque: function(){
        this.cheque = new Cheque();
    },

    addCheque: function(){
        if(!this.cheque.esValido()){
            return;
        }
        this.cheque.nombreBanco = $('#banco_cheque option:selected').text();

        this.cheque.cheques.push(this.cheque.getJSON());
        this.cheque.clearData();
    },

    removeCheque: function(indice){
        this.cheque.cheques.splice(indice, 1);
    },

    guardar: function(){
        this.cheque.mensajes.cheques = '';

        if(!this.cheque.cheques.length){
            this.cheque.mensajes.cheques = 'Debe tener al menos 1 cheque';
            return;
        }

        this.scope.$emit('guia:agregarCheques', this.cheque.cheques);
        common.agregarMensaje('Se ha guardado los cheques exitosamente');
        $('#modal_cheque').modal('hide');

    }
});

module.exports = ChequeController;

},{"./../../models/liquidacion/cheque_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cheque_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cupon_prepago_controller.js":[function(require,module,exports){
var CuponPrepago = require('./../../models/liquidacion/cupon_prepago_model.js');

function CuponPrepagoController($scope){
    this.scope = $scope;
    this.cuponPrepago = null;
}

CuponPrepagoController.mixin({
    resetearCuponPrepago: function(){
        this.cuponPrepago = new CuponPrepago();
    },

    guardarCuponPrepago: function(){
        if(!this.cuponPrepago.esValido()){
            return;
        }

        var clientePrepago = $('#cliente_prepago option:selected'),
            formatoPrepago = $('#formato_prepago option:selected');

        this.cuponPrepago.descuento = parseInt(formatoPrepago.data('descuento'));
        this.cuponPrepago.clienteNombre = clientePrepago.text();
        this.cuponPrepago.formatoNombre = formatoPrepago.text();

        this.scope.$emit('guia:agregarCuponesPrepago', this.cuponPrepago.getJSON());
        $('#modal_cupones_prepago').modal('hide');
    }
});

module.exports = CuponPrepagoController;

},{"./../../models/liquidacion/cupon_prepago_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cupon_prepago_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_lipigas_controller.js":[function(require,module,exports){
var GuiaPropiaController = require('./guia_propia_controller.js'),
    VentaLipigas = require('./../../models/liquidacion/venta_lipigas_model.js');

function GuiaLipigasController($scope, service){
    GuiaPropiaController.call(this, $scope, service);
}

GuiaLipigasController.mixin(GuiaPropiaController, {
    resetearGuia: function(){
        this.idCliente = null;
        this.descripcionDescuento = 'nada';
        this.venta = new VentaLipigas();
    },

    guardar: function(){
        this.venta.tipoVenta = 'lipigas';
        this.venta.cliente.idCliente = this.idCliente;

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía lipigas exitosamente');
        $('#modal_guia_lipigas').modal('hide');
    }
});

module.exports = GuiaLipigasController;

},{"./../../models/liquidacion/venta_lipigas_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_lipigas_model.js","./guia_propia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js":[function(require,module,exports){
var Producto = require('./../../models/liquidacion/producto_model.js'),
    VentaPropia = require('./../../models/liquidacion/venta_propia_model.js');

function GuiaPropiaController($scope, service){
    this.service = service;
    this.scope = $scope;

    this.venta = null;
    this.idCliente = null;
    this.descripcionDescuento = 'nada';
    this.cliente = {};
    this.producto = {};

    this.totalGuia = 0;
    this.descuento = {};
    this.mensajes = {};
}

GuiaPropiaController.mixin({
    resetearGuia: function(){
        this.idCliente = null;
        this.descripcionDescuento = 'nada';
        this.venta = new VentaPropia();
    },

    buscarCliente: function(){
        this.service.buscarCliente({ id_cliente: this.idCliente }, this.procesarCliente.bind(this));
    },

    procesarCliente: function(data){
        this.cliente.id = data.id;
        this.cliente.direccion = data.direccion;
        this.cliente.rut = data.rut;
        this.situacionComercial = data.situacion_comercial;
        this.descripcionDescuento = data.situacion_comercial.descripcion_descuento;

        this.descuento.codigo = data.situacion_comercial.codigo;
        this.descuento.credito = data.situacion_comercial.con_credito;
        this.descuento.simbolo = data.situacion_comercial.simbolo;
        this.descuento.cantidad = data.situacion_comercial.monto;
    },

    agregarProducto: function(){
        var obj,
            producto = null;

        if(!this.esValidoProducto()){
            return;
        }

        obj = JSON.parse(this.producto.tipo);

        producto = new Producto();
        producto.cantidad = this.producto.cantidad;
        producto.precio = obj.precio;
        producto.codigo = obj.codigo;
        producto.descuento = this.descuento;
        producto.calcularTotal();

        this.venta.addProducto(producto);
        this.producto = {};
    },

    esValidoProducto: function(){
        this.mensajes = {};

        if(!this.producto.tipo){
            this.mensajes.producto = 'No se ha seleccionado que producto se desea agregar';
            return false;
        }

        obj = JSON.parse(this.producto.tipo);

        if(!this.producto.cantidad || parseInt(this.producto.cantidad) < 1){
            this.mensajes.producto = 'Se debe ingresar una cantidad de producto';
            return false;
        }else if(obj.cantidad < parseInt(this.producto.cantidad)){
            this.mensajes.producto = 'No se puede elegir una mayor a la disponible';
            return false;
        }

        return true;
    },

    removeProducto: function(index){
        this.venta.removeProducto(index);
    },

    guardar: function(){
        this.venta.cliente.id = this.idCliente;
        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía propia exitosamente');
        $('#modal_guia_propia').modal('hide');
    }
});

module.exports = GuiaPropiaController;

},{"./../../models/liquidacion/producto_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/producto_model.js","./../../models/liquidacion/venta_propia_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_propia_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js":[function(require,module,exports){
var Monto = require('../../models/liquidacion/monto_model.js'),
    Dump = require('../../models/liquidacion/dump_model.js'),
    GuiaVenta = require('../../models/liquidacion/guia_venta_model.js');

function LiquidacionController($scope, liquidacionService){
    this.scope = $scope;
    this.service = liquidacionService;

    this.kilosVendidos = 0;
    this.dump = new Dump();

    this.productos = [];
    this.cheques = [];
    this.cuponesPrepago = [];
    this.otro = [];

    this.vouchers = { lipigas: null,transbank: null };
    this.monto = new Monto();
    this.guias = new GuiaVenta();

    this.suscribeEvents();
}

LiquidacionController.mixin({
    calcularSubTotal: function(){
        this.monto.calcularSubtotal(this.productos);
    },

    calcularKilos: function(){
        var _this = this;

        this.kilosVendidos = 0;

        this.productos.forEach(function(producto){
            var vacios = parseInt(producto.vacios),
                peso = parseInt(producto.peso);

            if(isNaN(vacios)){
                vacios = 0;
            }

            _this.kilosVendidos += vacios * peso;
        });
        this.productos_dump = JSON.stringify(this.productos);
    },

    resetearValores: function(){
        this.idCliente = null;
        this.guia = {};
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    },

    suscribeEvents: function(){
        this.scope.$on('liquidacion:addProductos', this.addProductos.bind(this));

        this.scope.$on('guia:calcularSubTotal', this.calcularSubTotal.bind(this));
        this.scope.$on('guia:calcularKilos', this.calcularKilos.bind(this));
        this.scope.$on('guia:agregarVenta', this.addGuia.bind(this));
        this.scope.$on('guia:agregarVoucher', this.addVouchers.bind(this));
        this.scope.$on('guia:agregarCheques', this.addCheques.bind(this));
        this.scope.$on('guia:agregarCuponesPrepago', this.addCuponesPrepago.bind(this));
        this.scope.$on('guia:agregaOtro', this.addOtro.bind(this));
    },

    addProductos: function(evt, productos){
        this.productos = this.scope.productos = productos;
    },

    addGuia: function(evt, venta){
        this.guias.addGuia(venta);
        this.renderTabla('tpl_tabla_ventas', 'tabla_ventas', this.guias);

        var tmp = {
            "propias": this.guias.propia.ventas,
            "lipigas": this.guias.lipigas.ventas
        };

        this.guia_dump = tmp;
    },

    addVouchers: function(evt, voucher){
        if(!(voucher.tipo in this.vouchers)){
            throw new TypeError('el voucher {0} no es lipigas ni transbank es {1}'.format(index, voucher.tipo));
        }

        this.vouchers[voucher.tipo] = voucher;
        this.dump.setVouchers(this.vouchers);

        this.renderTabla('tpl_tabla_vouchers', 'tabla_vouchers', this.vouchers);
    },

    renderTabla: function(idTemplate, idTabla, data){
        var tpl = $('#' + idTemplate).html(),
            fx = Handlebars.compile(tpl),
            template;

        template = fx(data);
        $('#' + idTabla + ' tbody').empty().html(template);
    },

    addOtro: function(evt, otro){
        this.otro.push(otro);
        this.dump.setOtros(this.otro);
    },

    removeOtro: function(indice){
        this.otro.splice(indice, 1);
    },

    addCuponesPrepago: function(evt, cupones){
        this.cuponesPrepago.push(cupones);
        this.dump.setCuponesPrepago(this.cuponesPrepago);
    },

    removeCuponDescuento: function(indice){
        this.cuponesPrepago.splice(indice, 1);
    },

    addCheques: function(evt, cheques){
        var self = this;

        cheques.forEach(function(cheque){
            self.cheques.push(cheque);
        });

        this.dump.setCheques(this.cheques);
    },

    removeCheque:function(indice){
        this.cheques.splice(indice, 1);
    },

    cerrarLiquidacion: function(){
        var url = App.urls.get('liquidacion:cerrar');
        // TODO
        //this.productos_dump = JSON.stringify(this.productos);
        //this.montos_dump = JSON.stringify(this.montos);

        $("#f_cerrar_liquidacion").get(0).submit();
    },
});

module.exports = LiquidacionController;

},{"../../models/liquidacion/dump_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/dump_model.js","../../models/liquidacion/guia_venta_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/guia_venta_model.js","../../models/liquidacion/monto_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/monto_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/otro_controller.js":[function(require,module,exports){
var Otro = require('./../../models/liquidacion/otro_model.js');

function OtroController($scope){
    this.scope = $scope;
    this.otro = null;
}

OtroController.mixin({
    resetearOtro: function(){
        this.otro = new Otro();
    },

    guardar: function(){
        if(!this.otro.esValido()){
            return;
        }

        this.scope.$emit("guia:agregaOtro", this.otro.getJSON());
        common.agregarMensaje("Se ha guardado otroModel exitosamente");
        $('#modal_otros').modal('hide');
    }
});

module.exports = OtroController;

},{"./../../models/liquidacion/otro_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/otro_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/panel_busqueda_controller.js":[function(require,module,exports){
function PanelBusquedaController($scope, service){
    this.scope = $scope;
    this.service = service;
    this.idGuiaDespacho = null;

    this.kilosVendidos = 0;
    this.vehiculo = {};
    this.guia = {};
    this.boleta = {};
}

PanelBusquedaController.prototype = {
    constructor: PanelBusquedaController,

    buscar: function(){
        if(!this.idGuiaDespacho){
            return;
        }

        this.service.buscarGuia(this.idGuiaDespacho, this.procesarBusqueda.bind(this));
    },

    procesarBusqueda: function(data){
        if(data.boleta.mensaje){
            alert(data.boleta.mensaje);
            return;
        }

        this.boleta = data.boleta;
        this.guia = data.guia;
        this.guia.fecha = common.fecha.djangoToDate(this.guia.fecha);
        this.vehiculo = data.vehiculo;

        this.scope.$emit('liquidacion:addProductos', data.productos);
    },

    actualizarKm: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    }
};

module.exports = PanelBusquedaController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js":[function(require,module,exports){
function ProductoController($scope){
    this.scope = $scope;
}

ProductoController.mixin({
    calculaValorTotal: function(producto){
        var valorTotal = 0;
        valorTotal = parseInt(producto.vacios) * parseInt(producto.precio);

        if(isNaN(valorTotal)){
            valorTotal = 0;
        }

        producto.valorTotal = valorTotal;
    },

    calcularRestante: function(producto){
        var aux = parseInt(producto.cantidad) - parseInt(producto.llenos);

        if(isNaN(aux) || aux < 0){
            aux = 0;
        }

        if(producto.cantidad < parseInt(producto.llenos)){
            producto.llenos = producto.cantidad;
        }

        producto.vacios = aux;
        this.calculaValorTotal(producto);
        this.scope.$emit("guia:calcularSubTotal");
        this.scope.$emit("guia:calcularKilos");
    }
});

module.exports = ProductoController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_lipigas_controller.js":[function(require,module,exports){
var VoucherLipigas = require('./../../models/liquidacion/voucher_lipigas_model.js');

function VoucherLipigasController($scope){
    this.scope = $scope;

    this.numero = 0;
    this.terminal = null;
    this.tarjeta = null;
    this.monto = null;
    this.descuento = 0;

    this.voucher = null;
    this.mensajes = {};
}

VoucherLipigasController.mixin({
    resetearVoucher: function(){
        this.mensajes = {};
        this.voucher = new VoucherLipigas();
    },

    addTarjeta: function(){
        if(!this._esValidaTarjeta()){
            return;
        }

        var tarjeta = {
            id: this.tarjeta,
            nombre: $('#tarjeta_comercial_lipigas option:selected').text(),
            monto: this.monto
        };

        this.voucher.addTarjeta(tarjeta);
        this.tarjeta = null;
        this.monto = null;
    },

    removeTarjeta: function(index){
        this.voucher.removeTarjeta(index);
    },

    guardar: function(){
        if(!this._esValidaVenta()){
            return;
        }

        this.voucher.numero = this.numero;
        this.scope.$emit("guia:agregarVoucher", this.voucher);

        $('#modal_voucher_lipigas').modal('hide');
        common.agregarMensaje('El voucher de lipigas ha sido agregado exitosamente');
    },

    hacerDescuento: function(){
        var descuento = parseInt(this.descuento);

        if(isNaN(descuento)){
            descuento = 0;
        }

        this.voucher.setDescuento(descuento);
    },

    _esValidaTarjeta: function(){
        if(!this.tarjeta){
            this.mensajes.tarjeta = 'Debe seleccionar una tarjeta';
            return false;
        }

        if(!this.monto || isNaN(this.monto) || parseInt(this.monto) < 1){
            this.mensajes.tarjeta = 'Debe elegir un monto válido';
            return false;
        }

        return true;
    },

    _esValidaVenta: function(){
        var valido = true;
        this.mensajes = {};

        if(!this.numero){
            this.mensajes.numero = 'campo obligatorio';
            valido = false;
        }

        if(!this.terminal){
            this.mensajes.terminal = 'campo obligatorio';
            valido = false;
        }

        if(!this.voucher.tarjetas.length){
            this.mensajes.tarjeta = 'debe ingresar al menos 1 tarjeta';
            valido = false;
        }

        return valido;
    }
});

module.exports = VoucherLipigasController;

},{"./../../models/liquidacion/voucher_lipigas_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_lipigas_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_transbank_controller.js":[function(require,module,exports){
var VoucherTransbank = require('./../../models/liquidacion/voucher_transbank_model.js');

function VoucherTransbankController($scope){
    this.voucher = null;
    this.scope = $scope;

    this.idTarjeta = null;
    this.monto = 0;
    this.cuotas = 1;

    this.mensajes = {};
}

VoucherTransbankController.mixin({
    addTarjeta: function(){
        if(!this._esValidaTarjeta()){
           return;
        }

        var tarjeta = {
            id: this.idTarjeta,
            nombre: $('#tarjeta_comercial_transbank option:selected').text(),
            monto: this.monto,
            cuotas: this.cuotas
        };

        this.voucher.addTarjeta(tarjeta);

        this.idTarjeta = null;
        this.monto = 0;
        this.cuotas = 1;
    },

    removeTarjeta: function(index){
        this.voucher.removeTarjeta(index);
    },

    guardar: function(){
        if(this._esValidaVenta()){
            return;
        }

        this.scope.$emit('guia:agregarVoucher', this.voucher);

        $('#modal_voucher_transbank').modal('hide');
        common.agregarMensaje('Los vouchers han sido guardados exitosamente');
    },

    resetearVoucher: function(){
        this.voucher = new VoucherTransbank();
    },

    _esValidaTarjeta: function(){
        var valido = true;

        this.mensajes = {};

        if(!this.idTarjeta){
            this.mensajes.tarjeta = 'campo obligatorio';
            valido = false;
        }

        if(!this.monto){
            this.mensajes.monto = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.monto)){
            this.mensajes.monto = 'monto inválido';
            valido = false;
        }else if(parseInt(this.monto) < 1){
            this.mensajes.monto = 'el monto a ingresar debe ser mayor a 0';
        }

        if(!this.cuotas){
            this.mensajes.cuotas = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.cuotas)){
            this.mensajes.cuotas = 'valor inválido';
            valido = false;
        }else if(parseInt(this.cuotas) < 1){
            this.mensajes.cuotas = 'el monto a ingresar debe ser mayor a 0';
            valido = false;
        }

        return valido;
    },

    _esValidaVenta: function(){
        this.mensajes = {};

        if(!this.voucher.tarjetas.length){
            this.mensajes.tarjeta = 'Debe al menos ingresar una tarjeta';
            return false;
        }

        return true;
    }
});

module.exports = VoucherTransbankController;

},{"./../../models/liquidacion/voucher_transbank_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_transbank_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cheque_model.js":[function(require,module,exports){
var Cheque = function(){
    this.banco = null;
    this.nombreBanco = null;
    this.numero = null;
    this.monto = null;
    this.fecha = null;

    this.cheques = [];
    this.mensajes = {};
};

Cheque.mixin({
    getJSON: function(){
        var json = {
            banco: {
                id: this.banco,
                nombre: this.nombreBanco
            },
            numero: this.numero,
            fecha: this.fecha,
            monto: this.monto
        };

        return json;
    },

    esValido: function(){
        var valido = true;

        valido = this.esValidoBanco() && valido;
        valido = this.esValidoNumero() && valido;
        valido = this.esValidoMonto() && valido;
        valido = this.esValidaFecha() && valido;

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    _esFechaValida: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(!type.isDate(this[campo])){
            valido = false;
            this.mensajes[campo] = "fecha inválida";
        }

        return valido;
    },

    esValidoBanco: function(){
        var valido = true;
        this.mensajes.banco = "";

        if(!this.banco){
            valido = false;
            this.mensajes.banco = "campo obligatorio";
        }

        return valido;
    },

    esValidoNumero: function(){
        return this._esNumeroValido("numero");
    },

    esValidoMonto: function(){
        return this._esNumeroValido("monto");
    },

    esValidaFecha:function(){
        return this._esFechaValida("fecha");
    },

    clearData:function(){
        this.banco = null;
        this.numero = null;
        this.monto = null;
        this.fecha = null;
    }
});

module.exports = Cheque;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cupon_prepago_model.js":[function(require,module,exports){
var CuponPrepago = function(){
    this.numero = null;
    this.clienteId = null;
    this.clienteNombre = null;
    this.formatoNombre = null;
    this.formatoId = null;
    this.descuento = null;

    this.mensajes = {};
};

CuponPrepago.mixin({
    getJSON: function(){
        var json = {
            cliente: {
                id : this.clienteId,
                nombre : this.clienteNombre
            },
            formato: {
                id : this.formatoId,
                nombre: this.formatoNombre
            },
            numero: this.numero,
            descuento: this.descuento
        };

        return json;
    },

    esValido: function(){
        var valido = true;

        valido = this.esValidoNumero() && valido;
        valido = this.esValidoFormato() && valido;
        valido = this.esValidoClienteId() && valido;

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }else if(parseInt(this[campo]) < 0){
            valido = false;
            this.mensajes[campo] = "el valor debe ser positivo";
        }

        return valido;
    },

    esValidoNumero: function(){
        return this._esNumeroValido("numero");
    },

    esValidoClienteId: function(){
        var valido = true;
        this.mensajes.clienteId = "";

        if(!this.clienteId){
            valido = false;
            this.mensajes.clienteId = "campo obligatorio";
        }

        return valido;
    },

    esValidoFormato: function(){
        var valido = true;
        this.mensajes.formatoId = ""

        if(!this.formatoId){
            valido = false;
            this.mensajes.formatoId = "campo obligatorio";
        }

        return valido;
    },

    esValidoDescuento: function(){
        return this._esNumeroValido("descuento");
    },

    clearData: function(){
        this.numero = null;
        this.clienteId = null;
        this.clienteNombre = null;
        this.formato = null;
        this.descuento = null;
    }

});

module.exports = CuponPrepago;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/dump_model.js":[function(require,module,exports){
function Dump(){
    this.productos = null;
    this.cheques = null;
    this.cuponesPrepago = null;
    this.otros = null;
    this.vouchers = null;
    this.guia = null;
    this.montos = null;
}

Dump.prototype = {
    constructor: Dump,

    setProductos: function(productos){
        this.productos = JSON.stringify(productos);
    },

    setCheques: function(cheques){
        this.cheques = JSON.stringify(cheques);
    },

    setCuponesPrepago: function(cuponesPrepago){
        this.cuponesPrepago = JSON.stringify(cuponesPrepago);
    },

    setOtros: function(otros){
        this.otros = JSON.stringify(otros);
    },

    setVouchers: function(vouchers){
        this.vouchers = JSON.stringify(vouchers);
    },

    setGuia: function(){

    },

    setMontos: function(){

    },

    toJSON: function(){
        return {
            'productos': this.productos,
            'cheques': this.cheques,
            'cuponesPrepago': this.cuponesPrepago,
            'otros': this.otros,
            'vouchers': this.vouchers,
            'guias': this.guias
        };
    }
};

module.exports = Dump;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/guia_venta_model.js":[function(require,module,exports){
function GuiaVenta(){
    this.propia = {
        rowspan: 0,
        ventas: []
    };

    this.lipigas = {
        rowspan: 0,
        ventas: []
    };
}

GuiaVenta.mixin({
    addGuia: function(guia){
        if(guia.tipo !== 'propia' && guia.tipo !== 'lipigas'){
            throw TypeError('La guia ingresada no es ni lipigas ni es propia, es ' + guia.tipo);
        }

        if(guia.tipo === 'propia'){
            this._addGuiaPropia(guia);
        }else{
            this._addGuiaLipigas(guia);
        }
    },

    _addGuiaPropia: function(guiaPropia){
        this.propia.ventas.push(guiaPropia);
        this._addRowspan('propia', guiaPropia);
    },

    _addGuiaLipigas: function(guiaLipigas){
        this.lipigas.ventas.push(guiaLipigas);
        this._addRowspan('lipigas', guiaLipigas);
    },

    _addRowspan: function(tipo, guia){
        this[tipo].rowspan += guia.productos.length;
    }
});

module.exports = GuiaVenta;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/monto_model.js":[function(require,module,exports){
function Monto(){
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.propias = 0;
    this.lipigas = 0;
    this.voucherLipigas = 0;
    this.voucherTransbank = 0;
    this.cheques = 0;
    this.cupones = 0;
    this.otros = 0;
}

Monto.prototype = {
    constructor: Monto,

    calcularSubtotal: function(productos){
        var i, producto;
        this.subTotal = 0;

        for(i = 0; i < productos.length; i++){
            producto = productos[i];
            this._sumarSubtotal(producto);
        }

        this.total = this.subTotal + this.descuentos;
    },

    _sumarSubtotal: function(producto){
        if(isNaN(producto.valorTotal)){
            return;
        }

        this.subTotal += producto.valorTotal;
    }
}

module.exports = Monto;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/otro_model.js":[function(require,module,exports){
var Otro = function(){
    this.concepto = null;
    this.monto = null;

    this.mensajes={};
};

Otro.mixin({
    getJSON: function(){
        var json = {
            concepto : this.concepto,
            monto : this.monto
        };

        return json;
    },

    esValido: function(){
        var valido = true;

        valido = this.esMontoValido() && valido;
        valido = this.esConceptoValido() && valido;

        return valido;
    },

    _esNumeroValido: function(campo){
        var valido = true;

        this.mensajes[campo] = "";

        if(!this[campo]){
            valido = false;
            this.mensajes[campo] = "campo obligatorio";
        }else if(isNaN(this[campo])){
            valido = false;
            this.mensajes[campo] = "el valor debe ser numérico";
        }

        return valido;
    },

    esConceptoValido: function(){
        var valido = true;
        this.mensajes.concepto = "";

        if(this.concepto == null || this.concepto.trim() == ""){
            valido = false;
            this.mensajes.concepto = "campo obligatorio";
        }

        return valido;
    },

    esMontoValido: function(){
        return this._esNumeroValido("monto");
    }

});

module.exports = Otro;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/producto_model.js":[function(require,module,exports){
function Producto(){
    this.codigo = null;
    this.cantidad = null;
    this.descuento = null;
    this.montoDescuento = 0;
    this.precio = null;
    this.total = null;

    this.mensajes = {};
}

Producto.mixin({
    calcularTotal: function(){
        var subtotal = parseInt(this.precio) * parseInt(this.cantidad);
        this.total = this.calcularDescuento(subtotal);
    },

    calcularDescuento: function(subtotal){
        var neto = subtotal;

        if(this.descuento.credito){
            return neto;
        }

        if(this.descuento.simbolo === '%'){
            neto = this._descontarPorcentual(subtotal, this.descuento.cantidad);
        }else if(this.descuento.simbolo === '$'){
            neto = this._descontarFijo(subtotal, this.descuento.cantidad);
        }

        return neto;
    },

    _descontarPorcentual: function(subtotal, cantidadPorcentual){
        var montoDescuento, monto;

        montoDescuento = (subtotal * cantidadPorcentual) / 100.0;
        monto = subtotal - montoDescuento;
        this.montoDescuento = montoDescuento;

        return monto;
    },

    _descontarFijo: function(subtotal, descuento){
        var monto = subtotal,
            montoDescuento;

        if(this.codigo === this.descuento.codigo){
            montoDescuento = descuento * this.cantidad;
            monto = monto - montoDescuento;
            this.montoDescuento = montoDescuento;
        }

        return monto;
    }
});

module.exports = Producto;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_lipigas_model.js":[function(require,module,exports){
var Venta = require('./venta_model.js');

function VentaLipigas(){
    Venta.call(this, 'lipigas');
}

VentaLipigas.mixin(Venta,{});

module.exports = VentaLipigas;

},{"./venta_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_model.js":[function(require,module,exports){
function Venta(tipo){
    this.numero = 0;
    this.total = 0;
    this.tipo = tipo;
    this.cliente = {};
    this.productos = [];
}

Venta.mixin({
    addProducto: function(producto){
        this.productos.push(producto);
        this._calcularTotal();
    },

    removeProducto: function(index){
        this.productos.splice(index, 1);
        this._calcularTotal();
    },

    _calcularTotal: function(){
        var total = 0;

        this.productos.forEach(function(producto){
            total += parseInt(producto.total);
        });

        this.total = total;
    }
});

module.exports = Venta;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_propia_model.js":[function(require,module,exports){
var Venta = require('./venta_model.js');

function VentaPropia(){
    Venta.call(this, 'propia');
}

VentaPropia.mixin(Venta,{});

module.exports = VentaPropia;

},{"./venta_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_lipigas_model.js":[function(require,module,exports){
var Voucher = require('./voucher_model.js');

function VoucherLipigas(){
    Voucher.call(this, 'lipigas');
    this.descuento = 0;
    this.numero = null;
}

VoucherLipigas.mixin(Voucher,{
    setDescuento: function(descuento){
        if(isNaN(descuento)){
            throw new TypeError('El descuento debe ser numérico');
        }

        this.descuento = descuento;
        this._calcularTotal();
    },

    _calcularTotal: function(){
        var _this = this;
        this.total = 0;

        this.tarjetas.forEach(function(tarjeta){
            _this.total += parseInt(tarjeta.monto);
        });

        this.total -= this.descuento;
    }
});

module.exports = VoucherLipigas;

},{"./voucher_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_model.js":[function(require,module,exports){
function Voucher(tipo){
    this.tipo = tipo;
    this.tarjetas = [];
    this.total = 0;
}

Voucher.mixin({
    addTarjeta: function(tarjeta){
        this.tarjetas.push(tarjeta);
        this._calcularTotal();
    },

    removeTarjeta: function(index){
        this.tarjetas.splice(index, 1);
        this._calcularTotal();
    },

    _calcularTotal: function(){
        throw new Error('Método no implementado: _calcularTotal');
    }
});

module.exports = Voucher;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_transbank_model.js":[function(require,module,exports){
var Voucher = require('./voucher_model.js');

function VoucherTransbank(){
    Voucher.call(this, 'transbank');
}

VoucherTransbank.mixin(Voucher, {
    _calcularTotal: function(){}
});

module.exports = VoucherTransbank;

},{"./voucher_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/liquidacion_service.js":[function(require,module,exports){
var serviceUtil = require('./service_util.js');

function liquidacionService($http){
    var get, post, services;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        buscarGuia: function(data, callback){
            var data = { id_guia_despacho: data },
                url = App.urls.get('liquidacion:obtener_guia');

            get(url, data, callback);
        },

        buscarCliente: function(data, callback){
            var url = App.urls.get('liquidacion:buscar_cliente');
            get(url, data, callback);
        }
    };

    return services;
}

module.exports = liquidacionService;

},{"./service_util.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/services/service_util.js":[function(require,module,exports){
function noop(){}

function standardError(data){
    alert('ha ocurrido un error en el servidor !!!, por favor informe al administrador');
};

function processURL(url, params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    url += '?' + queryStr.join('&');
    return url;
};

function URLMaker(){
    this.url = null;
}

URLMaker.prototype.withThis = function(url){
    this.url = url;
    return this;
};

URLMaker.prototype.doQuery = function(params){
    var queryStr = [];

    Object.keys(params).forEach(function(key){
        queryStr.push(key + '=' + params[key]);
    });

    this.url += '?' + queryStr.join('&');
    return this.url;
};

exports.standardError = standardError;
exports.processURL = processURL;
exports.URLMaker = URLMaker;

exports.getMaker = function($http){
    return function(){
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            url = args.shift();

        if(args.length){
            url = new URLMaker().withThis(url).doQuery(args[0]);
        }

        $http.get(url).success(callback || noop).error(standardError);
    };
};

exports.postMaker = function($http){
    return function(url, params, callback){
        $http.post(url, params).success(callback || noop).error(standardError);
    };
};

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/bundles/liquidacion_bundle.js"]);
