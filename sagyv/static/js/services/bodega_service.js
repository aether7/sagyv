var serviceUtil = require('./service_util.js');

function BodegaService($http){
    var services, get, post;

    get = serviceUtil.getMaker($http);
    post = serviceUtil.postMaker($http);

    services = {
        findProductos: function(callback){
            var url = App.urls.get('bodega:obtener_productos');
            get(url, callback);
        },

        findProductosTransito:function(callback){
            var url = App.urls.get('bodega:obtener_productos_transito');
            get(url, callback);
        },

        findConsolidados: function(callback){
            var url = App.urls.get('bodega:obtener_consolidados');
            get(url, callback);
        },

        findVehiculos: function(callback){
            var url = App.urls.get('bodega:obtener_vehiculos_seleccionables');
            get(url, callback);
        },

        obtenerGuia: function(id, callback){
            var url = App.urls.get('bodega:obtener_guia');
            get(url, params, { guia_id: id }, callback);
        },

        filtrarPorFecha: function(fecha, callback){
            var url = App.urls.get('bodega:filtrar_guias');
            get(url, { fecha: fecha }, callback);
        },

        guardarRecarga: function(params, callback){
            var url = App.urls.get('bodega:recargar_guia');
            post(url, params, callback);
        },

        crearGuia: function(params, callback){
            var url = App.urls.get('bodega:crea_guia');
            post(url, params, callback);
        },

        guardarFactura: function(params, callback){
            var url = App.urls.get('bodega:guardar_factura');
            post(url, params, callback);
        },

        findNumeroGuia: function(callback){
            var url = App.urls.get('bodega:obtener_id_guia');
            get(url, callback);
        },

        findVehiculoByProducto: function(id, callback){
            var url = App.urls.get('bodega:obtener_vehiculos_por_producto');
            get(url, { producto_id: id }, callback);
        },

        findDetalleConsolidado: function(id, callback){
            var url = App.urls.get('bodega:obtener_detalle_consolidado');
            get(url, { producto_id: id }, callback);
        }
    };

    return services;
}

module.exports = BodegaService;
