function LiquidacionController($http, $scope){
    this.productos = [];

    this.guia = {};

    this.idVehiculo = null;
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.fecha = null;
    this.vehiculo = null;

    this.http = $http;
    this.scope = $scope;

    this.suscribeEvents();
}

LiquidacionController.prototype = {
    constructor: LiquidacionController,

    buscarGuia: function(){
        var url = App.urls.get("liquidacion:obtener_guia"),
            _this = this;

        url += "?id_vehiculo=" + this.idVehiculo;

        this.resetearValores();
        this.http.get(url).success(this.cargaDatosCabecera.bind(this));
    },

    cargaDatosCabecera: function(data){
        this.guia = data.guia;
        this.guia.fecha = new Date();

        this.productos = data.productos;

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

    resetearValores: function(){
        this.idCliente = null;
        this.guia = {};
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    },

    suscribeEvents: function(){
        this.scope.$on("guia:calcularSubTotal", this.calcularSubTotal.bind(this));
    },

    cerrarLiquidacion: function(){
        var url = App.urls.get("liquidacion:cerrar");
        window.location.href = url;
    }
};

module.exports = LiquidacionController;
