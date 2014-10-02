#SECCION ANGULAR
app = angular.module 'precioApp', [], App.httpProvider

precioService = ($http)->
    standardError = (data)->
        alert 'Ha ocurrido un error en el servidor'

    services =
        actualizarPrecio: (precios, callback)->
            url = App.urls.get 'precios:update_precios'
            $http.post(url, precios).success(callback).error(standardError)

        actualizarStock: (stocks, callback)->
            url = App.urls.get 'precios:update_stock'
            $http.post(url, stocks).success(callback).error(standardError)

        findProductos: (callback)->
            url = App.urls.get 'precios:obtener_productos'
            $http.get(url).success(callback).error(standardError)

        findGarantias: (callback)->
            url = App.urls.get 'precios:obtener_garantias'
            $http.get(url).success(callback).error(standardError)

        findStocks: (callback)->
            url = App.urls.get 'precios:obtener_stocks'
            $http.get(url).success(callback).error(standardError)

    return services


class ProductoController
    procesarProductos: (data)->
        @productos = data.map (producto)->
            producto.valor = null
            return producto

    esValidoEnvio: ()->
        valido = yes

        @productos.forEach (producto)->
            delete producto.mensaje

            if producto.valor is '' or producto.valor is null
                producto.mensaje = 'campo obligatorio'
                valido = no
            else if isNaN(producto.valor)
                producto.mensaje = 'debe ingresar un número válido'
                valido = no

        return valido

    getPrecios: ()->
        precios = @productos.map (producto)->
            return { id: producto.id, valor: producto.valor }

        return precios

    actualizar: ()->
        if not this.esValidoEnvio()
            return

        obj =
            precios: JSON.stringify this.getPrecios()

        @service.actualizarPrecio obj, (data)=>
            common.agregarMensaje 'Los precios se han actualizado exitosamente'

            @productos.forEach (producto)->
                producto.precio = producto.valor
                producto.valor = null


class PrecioController extends ProductoController
    constructor: (service)->
        @service = service
        @productos = []
        @service.findProductos this.procesarProductos.bind(this)


class GarantiaController extends ProductoController
    constructor: (service)->
        @productos = []
        @service = service
        @service.findGarantias this.procesarProductos.bind(this)


class StockController
    constructor: (service)->
        @productos = []
        @service = service
        @service.findStocks this.procesarStock.bind(this)

    procesarStock: (data)->
        @productos = data.map (producto)->
            producto.valor = null
            return producto

    actualizar: ()->
        if not this.esValidoEnvio()
            return

        obj =
            productos: JSON.stringify this.getStocks()

        @service.actualizarStock obj, (data)=>
            common.agregarMensaje 'Los precios se han actualizado exitosamente'

            @productos.forEach (producto)->
                producto.nivelCritico = producto.valor
                producto.valor = null

    esValidoEnvio: ()->
        valido = yes

        @productos.forEach (producto)->
            delete producto.mensaje

            if producto.valor is '' or producto.valor is null
                producto.mensaje = 'campo obligatorio'
                valido = no
            else if isNaN(producto.valor)
                producto.mensaje = 'debe ingresar un número válido'
                valido = no

        return valido

    getStocks: ()->
        stocks = @productos.map (producto)->
            return { id: producto.id, stock: producto.valor }

        return stocks


app.factory 'precioService', ['$http', precioService]

app.controller 'PrecioController', ['precioService', PrecioController]
app.controller 'GarantiaController', ['precioService', GarantiaController]
app.controller 'StockController', ['precioService', StockController]
#FIN SECCION ANGULAR

# SECCION DE JQUERY Y MANIPULACION DE DOM
moverInputs = (modo)->
    UP = 38
    DOWN = 40

    return (evt)->
        tipoColumna = $(this).data('columna' + modo)
        numeroActual = parseInt tipoColumna

        if evt.which is UP and numeroActual > 1
            numeroActual--
        else if evt.which is DOWN
            numeroActual++
        else
            valor = $(this).val().replace(/\D/gi, "")
            $(this).val(valor)

        $("[data-columna-#{modo.toLowerCase()}=#{numeroActual}]").trigger('focus');


$(document).on('keyup', '[data-columna-normal]', moverInputs('Normal'))
$(document).on('keyup', '[data-columna-garantias]', moverInputs('Garantias'))
$(document).on('keyup', '[data-columna-stock]', moverInputs('Stock'))
