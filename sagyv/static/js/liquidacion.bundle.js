(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cheque_controller.js":[function(require,module,exports){
var Cheque = require('./../../models/liquidacion/cheque_model.js');

function ChequeController($http, $scope){
    this.http = $http;
    this.scope = $scope;
    this.cheque = new Cheque();
}

ChequeController.mixin({
    //insert magic here
    agregarCheque: function(){
        console.log(this.cheque);

        if(!this.cheque.esValido()){
            console.log(this.cheque.mensajes.banco);
            return;
        }

        some = {
            banco : this.cheque.banco,
            numero : this.cheque.numero,
            monto : this.cheque.monto,
            fecha : this.cheque.fecha
        };

        this.cheque.cheques.push(some);
    },

    removeCheque: function(indice){
        this.cheque.cheques.splice(indice, 1);
    },

    //se guardara 1 x 1 (?)
});

module.exports = ChequeController;

},{"./../../models/liquidacion/cheque_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cheque_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_lipigas_controller.js":[function(require,module,exports){
var GuiaPropiaController = require('./guia_propia_controller.js');

function GuiaLipigasController($http, $scope){
    GuiaPropiaController.call(this, $http, $scope);
}

GuiaLipigasController.mixin(GuiaPropiaController, {
    guardar: function(){
        this.venta.tipoVenta = 'lipigas';

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía lipigas exitosamente');
        $('#modal_guia_lipigas').modal('hide');
    }
});

module.exports = GuiaLipigasController;

},{"./guia_propia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js":[function(require,module,exports){
var Producto = require('./../../models/liquidacion/producto_model.js'),
    Venta = require('./../../models/liquidacion/venta_model.js');

function GuiaPropiaController($http, $scope){
    this.venta = null;
    this.idCliente = null;
    this.descripcionDescuento = 'nada';
    this.http = $http;
    this.scope = $scope;
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
        this.venta = new Venta();
    },

    buscarCliente: function(){
        var url = App.urls.get('liquidacion:buscar_cliente');
        url += '?id_cliente=' + this.idCliente;

        this.http.get(url).success(this.procesarCliente.bind(this));
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
        this.venta.tipoVenta = "propia";

        this.scope.$emit("guia:agregarVenta", this.venta);
        common.agregarMensaje('Se ha guardado guía propia exitosamente');
        $('#modal_guia_propia').modal('hide');
    }
});

module.exports = GuiaPropiaController;

},{"./../../models/liquidacion/producto_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/producto_model.js","./../../models/liquidacion/venta_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js":[function(require,module,exports){
function LiquidacionController($http, $scope){
    this.productos = [];
    this.boleta = null;

    this.guia = {};
    this.ventas = [];

    this.idGuiaDespacho = null;
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.kilosVendidos = 0;
    this.fecha = null;
    this.vehiculo = null;

    this.http = $http;
    this.scope = $scope;

    this.suscribeEvents();
}

LiquidacionController.mixin({
    buscarGuia: function(){
        var url = App.urls.get("liquidacion:obtener_guia"),
            _this = this;

        url += "?id_guia_despacho=" + this.idGuiaDespacho;

        this.resetearValores();
        this.http.get(url).success(this.cargaDatosCabecera.bind(this));
    },

    cargaDatosCabecera: function(data){
        this.guia = data.guia;
        this.boleta = data.boleta;
        this.guia.boleta = data.boleta.actual;
        this.guia.fecha = new Date();

        this.productos = this.scope.productos = data.productos;

        this.vehiculo = data.vehiculo;
        this.vehiculo.kilometrosRecorridos = 0;
        this.vehiculo.kmActual = 0;
    },

    actualizarKilometraje: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    },

    calcularSubTotal: function(){
        var _this = this;

        this.subTotal = 0;

        this.productos.forEach(function(producto){
            if(isNaN(producto.valorTotal)){
                return;
            }

            _this.subTotal += producto.valorTotal;
        });

        this.total = this.subTotal - this.descuentos;
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
    },

    resetearValores: function(){
        this.idCliente = null;
        this.guia = {};
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    },

    suscribeEvents: function(){
        this.scope.$on("guia:calcularSubTotal", this.calcularSubTotal.bind(this));
        this.scope.$on("guia:calcularKilos", this.calcularKilos.bind(this));
        this.scope.$on("guia:agregarVenta", this.addVenta.bind(this));
    },

    addVenta: function(evt, venta){
        this.ventas.push(venta);
    },

    cerrarLiquidacion: function(){
        var url = App.urls.get("liquidacion:cerrar");
        window.location.href = url;
    }
});

module.exports = LiquidacionController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js":[function(require,module,exports){
function ProductoController($scope){
    this.scope = $scope;
}

ProductoController.prototype = {
    constructor: ProductoController,

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
};

module.exports = ProductoController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_lipigas_controller.js":[function(require,module,exports){
var Voucher = require('./../../models/liquidacion/voucher_model.js');


function VoucherLipigasController($http, $scope){
    this.scope = $scope;

    this.numero = 0;
    this.terminal = null;
    this.tarjeta = null;
    this.monto = null;
    this.descuento = 0;

    this.voucher = {};
    this.mensajes = {};
}

VoucherLipigasController.mixin({
    resetearVoucher: function(){
        this.voucher = new Voucher();
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
        this.voucher.numero = this.numero;
        this.voucher.tipoVenta = 'voucher Lipigas';

        this.scope.$emit("guia:agregarVenta", this.voucher);

        $('#modal_voucher_lipigas').modal('hide');
        common.agregarMensaje('El voucher de lipigas ha sido agregado exitosamente');
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

    hacerDescuento: function(){
        var descuento = parseInt(this.descuento);

        if(isNaN(descuento)){
            descuento = 0;
        }

        this.voucher.setDescuento(descuento);
    }
});

module.exports = VoucherLipigasController;

},{"./../../models/liquidacion/voucher_model.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_model.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_transbank_controller.js":[function(require,module,exports){
function VoucherTransbankController($http, $scope){
    this.scope = $scope;
    this.vouchers = [];
    this.voucher = {};
}

VoucherTransbankController.mixin({
    addVoucher: function(){
        this.vouchers.push();
    },

    removeVoucher: function(index){
        this.vouchers.splice(index, 1);
    }
});

module.exports = VoucherTransbankController;

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js":[function(require,module,exports){
(function(){
'use strict';

var app = angular.module('liquidacionApp',[]),
    LiquidacionController = require('./controllers/liquidacion/liquidacion_controller.js'),
    ProductoController = require('./controllers/liquidacion/producto_controller.js'),
    GuiaPropiaController = require('./controllers/liquidacion/guia_propia_controller.js'),
    GuiaLipigasController = require('./controllers/liquidacion/guia_lipigas_controller.js'),
    VoucherLipigasController = require('./controllers/liquidacion/voucher_lipigas_controller.js'),
    VoucherTransbankController = require('./controllers/liquidacion/voucher_transbank_controller.js'),
    ChequeController = require('./controllers/liquidacion/cheque_controller.js');

app.controller('LiquidacionController', ['$http','$scope', LiquidacionController]);
app.controller('ProductoController', ['$scope', ProductoController]);
app.controller('GuiaPropiaController', ['$http', '$scope', GuiaPropiaController]);
app.controller('GuiaLipigasController', ['$http', '$scope', GuiaLipigasController]);
app.controller('VoucherLipigasController', ['$http', '$scope', VoucherLipigasController]);
app.controller('VoucherTransbankController', ['$http', '$scope', VoucherTransbankController]);
app.controller('ChequeController', ['$http', '$scope', ChequeController]);

})();

$('button[data-accion=abre_modal]').on('click', function(evt){
    $('#modal_' + $(this).data('modal')).modal('show');
});

},{"./controllers/liquidacion/cheque_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/cheque_controller.js","./controllers/liquidacion/guia_lipigas_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_lipigas_controller.js","./controllers/liquidacion/guia_propia_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/guia_propia_controller.js","./controllers/liquidacion/liquidacion_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/liquidacion_controller.js","./controllers/liquidacion/producto_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/producto_controller.js","./controllers/liquidacion/voucher_lipigas_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_lipigas_controller.js","./controllers/liquidacion/voucher_transbank_controller.js":"/Users/Aether/Proyectos/sagyv/sagyv/static/js/controllers/liquidacion/voucher_transbank_controller.js"}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/cheque_model.js":[function(require,module,exports){
var Cheque = function(){
    this.banco = null;
    this.numero = null;
    this.monto = null;
    this.fecha = null;

    this.cheques = [];
    this.mensajes = {};
};

Cheque.mixin({
    getJSON: function(){
        var json = {
            cheques : this.cheques
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
    }
});

module.exports = Cheque;

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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/venta_model.js":[function(require,module,exports){
function Venta(){
    this.numero = 0;
    this.total = 0;
    this.tipoVenta = null;
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

},{}],"/Users/Aether/Proyectos/sagyv/sagyv/static/js/models/liquidacion/voucher_model.js":[function(require,module,exports){
function Voucher(){
    this.numero = null;
    this.tarjetas = [];
    this.descuento = 0;
    this.total = 0;
}

Voucher.mixin({
    setDescuento: function(descuento){
        if(isNaN(descuento)){
            throw new TypeError('El descuento debe ser numérico');
        }

        this.descuento = descuento;
        this._calcularTotal();
    },

    addTarjeta: function(tarjeta){
        this.tarjetas.push(tarjeta);
        this._calcularTotal();
    },

    removeTarjeta: function(index){
        this.tarjetas.splice(index, 1);
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

module.exports = Voucher;

},{}]},{},["/Users/Aether/Proyectos/sagyv/sagyv/static/js/liquidacion_bundle.js"]);
