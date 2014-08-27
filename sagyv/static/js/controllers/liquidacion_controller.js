function LiquidacionController($http){
    this.productos = [];
    this.idVehiculo = null;
    this.numeroGuia = null;
    this.subTotal = 0;
    this.descuentos = 0;
    this.total = 0;
    this.http = $http;

    this.vehiculo = {
        kilometrosRecorridos : 0,
        kmActual : 0
    };
}

LiquidacionController.prototype = {
    constructor: LiquidacionController,

    buscarGuia: function(){
        var url = App.urls.get("liquidacion:obtener_guia"),
            _this = this;

        url += "?id_vehiculo=" + this.idVehiculo;
        this.resetearValores();

        this.http.get(url).success(function(data){
            _this.productos = data.productos;
            _this.vehiculo = data.vehiculo;
            _this.vehiculo.kilometrosRecorridos = 0;
        });
    },

    actualizarKilometraje: function(){
        this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
    },

    calcularSubTotal: function(){
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
        this.numeroGuia = null;
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
    }
};

module.exports = LiquidacionController;
