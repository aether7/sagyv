// Generated by CoffeeScript 1.7.1
(function() {
  var GarantiaController, PrecioController, ProductoController, StockController, app, moverInputs, precioService,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('precioApp', [], App.httpProvider);

  precioService = function($http) {
    var services, standardError;
    standardError = function(data) {
      return alert('Ha ocurrido un error en el servidor');
    };
    services = {
      actualizarPrecio: function(precios, callback) {
        var url;
        url = App.urls.get('precios:update_precios');
        return $http.post(url, precios).success(callback).error(standardError);
      },
      actualizarStock: function(stocks, callback) {
        var url;
        url = App.urls.get('precios:update_stock');
        return $http.post(url, stocks).success(callback).error(standardError);
      },
      findProductos: function(callback) {
        var url;
        url = App.urls.get('precios:obtener_productos');
        return $http.get(url).success(callback).error(standardError);
      },
      findGarantias: function(callback) {
        var url;
        url = App.urls.get('precios:obtener_garantias');
        return $http.get(url).success(callback).error(standardError);
      },
      findStocks: function(callback) {
        var url;
        url = App.urls.get('precios:obtener_stocks');
        return $http.get(url).success(callback).error(standardError);
      }
    };
    return services;
  };

  ProductoController = (function() {
    function ProductoController() {}

    ProductoController.prototype.procesarProductos = function(data) {
      return this.productos = data.map(function(producto) {
        producto.valor = null;
        return producto;
      });
    };

    ProductoController.prototype.esValidoEnvio = function() {
      var valido;
      valido = true;
      this.productos.forEach(function(producto) {
        delete producto.mensaje;
        if (producto.valor === '' || producto.valor === null) {
          producto.mensaje = 'campo obligatorio';
          return valido = false;
        } else if (isNaN(producto.valor)) {
          producto.mensaje = 'debe ingresar un número válido';
          return valido = false;
        }
      });
      return valido;
    };

    ProductoController.prototype.getPrecios = function() {
      var precios;
      precios = this.productos.map(function(producto) {
        return {
          id: producto.id,
          valor: producto.valor
        };
      });
      return precios;
    };

    ProductoController.prototype.actualizar = function() {
      var obj;
      if (!this.esValidoEnvio()) {
        return;
      }
      obj = {
        precios: JSON.stringify(this.getPrecios())
      };
      return this.service.actualizarPrecio(obj, (function(_this) {
        return function(data) {
          common.agregarMensaje('Los precios se han actualizado exitosamente');
          return _this.productos.forEach(function(producto) {
            producto.precio = producto.valor;
            return producto.valor = null;
          });
        };
      })(this));
    };

    return ProductoController;

  })();

  PrecioController = (function(_super) {
    __extends(PrecioController, _super);

    function PrecioController(service) {
      this.service = service;
      this.productos = [];
      this.service.findProductos(this.procesarProductos.bind(this));
    }

    return PrecioController;

  })(ProductoController);

  GarantiaController = (function(_super) {
    __extends(GarantiaController, _super);

    function GarantiaController(service) {
      this.productos = [];
      this.service = service;
      this.service.findGarantias(this.procesarProductos.bind(this));
    }

    return GarantiaController;

  })(ProductoController);

  StockController = (function() {
    function StockController(service) {
      this.productos = [];
      this.service = service;
      this.service.findStocks(this.procesarStock.bind(this));
    }

    StockController.prototype.procesarStock = function(data) {
      return this.productos = data.map(function(producto) {
        producto.valor = null;
        return producto;
      });
    };

    StockController.prototype.actualizar = function() {
      var obj;
      if (!this.esValidoEnvio()) {
        return;
      }
      obj = {
        productos: JSON.stringify(this.getStocks())
      };
      return this.service.actualizarStock(obj, (function(_this) {
        return function(data) {
          common.agregarMensaje('Los precios se han actualizado exitosamente');
          return _this.productos.forEach(function(producto) {
            producto.nivelCritico = producto.valor;
            return producto.valor = null;
          });
        };
      })(this));
    };

    StockController.prototype.esValidoEnvio = function() {
      var valido;
      valido = true;
      this.productos.forEach(function(producto) {
        delete producto.mensaje;
        if (producto.valor === '' || producto.valor === null) {
          producto.mensaje = 'campo obligatorio';
          return valido = false;
        } else if (isNaN(producto.valor)) {
          producto.mensaje = 'debe ingresar un número válido';
          return valido = false;
        }
      });
      return valido;
    };

    StockController.prototype.getStocks = function() {
      var stocks;
      stocks = this.productos.map(function(producto) {
        return {
          id: producto.id,
          stock: producto.valor
        };
      });
      return stocks;
    };

    return StockController;

  })();

  app.factory('precioService', ['$http', precioService]);

  app.controller('PrecioController', ['precioService', PrecioController]);

  app.controller('GarantiaController', ['precioService', GarantiaController]);

  app.controller('StockController', ['precioService', StockController]);

  moverInputs = function(modo) {
    var DOWN, UP;
    UP = 38;
    DOWN = 40;
    return function(evt) {
      var numeroActual, tipoColumna, valor;
      tipoColumna = $(this).data('columna' + modo);
      numeroActual = parseInt(tipoColumna);
      if (evt.which === UP && numeroActual > 1) {
        numeroActual--;
      } else if (evt.which === DOWN) {
        numeroActual++;
      } else {
        valor = $(this).val().replace(/\D/gi, "");
        $(this).val(valor);
      }
      return $("[data-columna-" + (modo.toLowerCase()) + "=" + numeroActual + "]").trigger('focus');
    };
  };

  $(document).on('keyup', '[data-columna-normal]', moverInputs('Normal'));

  $(document).on('keyup', '[data-columna-garantias]', moverInputs('Garantias'));

  $(document).on('keyup', '[data-columna-stock]', moverInputs('Stock'));

}).call(this);
