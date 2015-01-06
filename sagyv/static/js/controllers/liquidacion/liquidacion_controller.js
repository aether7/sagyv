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

    addProductos: function(evt, productos){
        this.productos = this.scope.productos = productos;
    },

    addGuia: function(evt, venta){
        this.guias.addGuia(venta);
        this.renderTabla('tpl_tabla_ventas', 'tabla_ventas', this.guias);
        this.monto.sumarGuias(this.guias.propia.ventas, this.guias.lipigas.ventas);
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
        this.monto.calcularCuponesPrepago(this.cuponesPrepago);
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
