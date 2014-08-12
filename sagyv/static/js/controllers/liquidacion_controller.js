(function(){
    var app = angular.module("liquidacionApp",[]);

    app.controller("LiquidacionController", ["$http",function($http){
        this.productos = [];
        this.idVehiculo = null;
        this.numeroGuia = null;
        this.subTotal = 0;
        this.descuentos = 0;
        this.total = 0;
        this.vehiculo = {
            kilometrosRecorridos : 0,
            kmActual : 0
        };

        var _this = this;

        this.buscarGuia = function(){
            var url = App.urls.get("liquidacion:obtener_guia");
                url += "?id_vehiculo=" + this.idVehiculo;

            this.resetearValores();

            $http.get(url).success(function(data){
                _this.productos = data.productos;
                _this.vehiculo = data.vehiculo;
                _this.vehiculo.kilometrosRecorridos = 0;
            });
        };

        this.actualizarKilometraje = function(){
            this.vehiculo.kilometrosRecorridos = this.vehiculo.kmActual - this.vehiculo.km;
        };

        this.calcularSubTotal = function(){
            this.subTotal = 0;

            this.productos.forEach(function(producto){
                if(isNaN(producto.valorTotal)){
                    return;
                }

                _this.subTotal += producto.valorTotal;
            });

            this.total = this.subTotal - this.descuentos;
        };

        this.resetearValores = function(){
            this.idCliente = null;
            this.numeroGuia = null;
            this.subTotal = 0;
            this.descuentos = 0;
            this.total = 0;
        };
    }]);

    app.controller("ProductoController", function(){
        var calculaValorTotal = function(producto){
            var valorTotal = 0;
            valorTotal = parseInt(producto.vacios) * parseInt(producto.precio);

            if(isNaN(valorTotal)){
                valorTotal = 0;
            }

            producto.valorTotal = valorTotal;
        };

        this.calcularRestante = function(producto){
            var aux = parseInt(producto.cantidad) - parseInt(producto.vacios);

            if(isNaN(aux) || aux < 0){
                aux = 0;
            }

            if(producto.cantidad < parseInt(producto.vacios)){
                producto.vacios = producto.cantidad;
            }

            producto.llenos = aux;
            calculaValorTotal(producto);

            return producto.llenos;
        };
    });

    app.controller("ClienteController", ["$http", function($http){
        var _this = this;

        this.idCliente = null;
        this.descripcionDescuento = "nada";
        this.cliente = {};

        this.buscarCliente = function(){
            var url = App.urls.get("liquidacion:buscar_cliente");
            url += "?id_cliente=" + this.idCliente;

            $http.get(url).success(function(data){
                _this.cliente.id = data.id;
                _this.cliente.direccion = data.direccion;
                _this.cliente.rut = data.rut;
                _this.situacionComercial = data.situacion_comercial;
                _this.descripcionDescuento = data.situacion_comercial.descripcion_descuento;
            });
        };
    }]);
})();

(function(){
    $("button[data-accion=abre_modal]").on("click", function(evt){
        common.mostrarModal($(this).data("modal"));
    });
})();
