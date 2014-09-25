function LiquidacionController($http, $scope){
    this.productos = [];
    this.boleta = null;

    this.guia = {};

    this.ventas = [];

    this.vouchers = {
        lipigas: [],
        transbank: []
    };

    this.cheques = [];

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
        this.scope.$on("guia:agregarVoucher", this.addVouchers.bind(this));
        this.scope.$on("guia:agregarCheques", this.addCheques.bind(this));
    },

    addVenta: function(evt, venta){
        this.ventas.push(venta);
    },

    addVouchers: function(evt, voucher){
        var self = this;

        if(!(voucher.tipo in self.vouchers)){
            throw "el voucher {0} no es lipigas ni transbank es {1}".format(index, voucher.tipo);
        }

        console.log(voucher);

        voucher.tarjetas.forEach(function(tarjeta){
            console.log(tarjeta);
            self.vouchers[voucher.tipo].push(tarjeta);
        });
    },

    addCheques: function(evt, cheques){
        var self = this;
        cheques.forEach(function(cheque){
            self.cheques.push(cheque);
        });
    },

    removeCheque:function(indice){
        console.log('indice '+ indice);

        this.cheques.splice(indice, 1);
    },

    cerrarLiquidacion: function(){
        var url = App.urls.get("liquidacion:cerrar");
        window.location.href = url;
    }
});

module.exports = LiquidacionController;
