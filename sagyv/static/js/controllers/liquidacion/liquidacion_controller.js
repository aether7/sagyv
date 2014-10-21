var GuiaVenta = require('./../../models/liquidacion/guia_venta_model.js');

function LiquidacionController($scope, liquidacionService){
    this.scope = $scope;
    this.service = liquidacionService;

    this.productos_dump = '';
    this.cheques_dump = '';
    this.cuponesPrepago_dump = '';
    this.otro_dump = '';
    this.vouchers_dump = '';
    this.guia_dump = '';
    this.montos_dump = '';
    this.this_guia_dump = '';

    this.productos = [];
    this.cheques = [];
    this.cuponesPrepago = [];
    this.otro = [];

    this.boleta = null;
    this.guia = {};

    this.vouchers = {
        lipigas: null,
        transbank: null
    };

    this.montos = {
        subTotal: 0,
        descuentos: 0,
        total: 0,
        propias: 0,
        lipigas: 0,
        voucherLipigas: 0,
        voucherTransbank: 0,
        cheques: 0,
        cupones: 0,
        otros: 0
    };

    this.guias = new GuiaVenta();
    this.idGuiaDespacho = null;
    this.kilosVendidos = 0;
    this.fecha = null;
    this.vehiculo = null;

    this.suscribeEvents();
}

LiquidacionController.mixin({
    buscarGuia: function(){
        var data = { id_guia_despacho: this.idGuiaDespacho };
        this.service.buscarGuia(data, this.cargaDatosCabecera.bind(this));
    },

    cargaDatosCabecera: function(data){
        if(data.boleta.mensaje){
            alert(data.boleta.mensaje);
            return;
        }

        this.guia = data.guia;
        this.boleta = data.boleta;
        this.guia.boleta = data.boleta.actual;

        tmp = this.guia.fecha.split('-');
        tmp[1] = (tmp[1] < 10)? '0' + tmp[1]: tmp[1];
        tmp[2] = (tmp[2] < 10)? '0' + tmp[2]: tmp[2];
        tmp[2] = parseInt(tmp[2]) + 1;

        this.guia.fecha = new Date(tmp.join('-'));
        this.productos = this.scope.productos = data.productos;

        this.vehiculo = data.vehiculo;
        this.vehiculo.kilometrosRecorridos = 0;
        this.vehiculo.kmActual = 0;
        this.this_guia_dump = JSON.stringify(this.guia);
    },

    actualizarKilometraje: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    },

    calcularSubTotal: function(){
        var _this = this;

        this.montos.subTotal = 0;

        this.productos.forEach(function(producto){
            if(isNaN(producto.valorTotal)){
                return;
            }

            _this.montos.subTotal += producto.valorTotal;
        });

        this.montos.total = this.montos.subTotal - this.montos.descuentos;
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


        console.log(this.guia);
    },

    resetearValores: function(){
        this.idCliente = null;
        this.guia = {};
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    },

    suscribeEvents: function(){
        this.scope.$on('guia:calcularSubTotal', this.calcularSubTotal.bind(this));
        this.scope.$on('guia:calcularKilos', this.calcularKilos.bind(this));
        this.scope.$on('guia:agregarVenta', this.addGuia.bind(this));
        this.scope.$on('guia:agregarVoucher', this.addVouchers.bind(this));
        this.scope.$on('guia:agregarCheques', this.addCheques.bind(this));
        this.scope.$on('guia:agregarCuponesPrepago', this.addCuponesPrepago.bind(this));
        this.scope.$on('guia:agregaOtro', this.addOtro.bind(this));
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
        this.vouchers_dump = JSON.stringify(this.vouchers);
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
        this.otro_dump = JSON.stringify(this.otro);
    },

    removeOtro: function(indice){
        this.otro.splice(indice, 1);
    },

    addCuponesPrepago: function(evt, cupones){
        this.cuponesPrepago.push(cupones);
        this.cuponesPrepago_dump = JSON.stringify(this.cuponesPrepago);
    },

    removeCuponDescuento: function(indice){
        this.cuponesPrepago.splice(indice, 1);
    },

    addCheques: function(evt, cheques){
        var self = this;

        cheques.forEach(function(cheque){
            self.cheques.push(cheque);
        });

        this.cheques_dump = JSON.stringify(this.cheques);
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
