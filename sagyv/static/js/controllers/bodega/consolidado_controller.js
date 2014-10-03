function ConsolidadoController($scope, service){
    this.scope = $scope;
    this.service = service;

    this.consolidados = [];

    this.addListeners();
    this.obtenerConsolidados();
}

ConsolidadoController.mixin({
    addListeners: function(){
        this.scope.$on('guia/recargarProductos', this.obtenerConsolidados.bind(this));
    },

    obtenerConsolidados: function(){
        this.service.findConsolidados(this.renderConsolidados.bind(this));
    },

    renderConsolidados: function(data){
        this.consolidados = data;
    },

    verDetalle: function(index){
        console.log(this.consolidados[index]);
    }
});

module.exports = ConsolidadoController;
