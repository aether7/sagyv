function Class(){
    var initialize, methods, dependencies, args;

    args = Array.prototype.slice.call(arguments);
    dependencies = args[0] || [];

    if(!Array.isArray(dependencies)){
        dependencies = [ dependencies ];
    }

    methods = args.pop();

    initialize = methods.initialize || function(){},
        cls = function(){ initialize.apply(this, arguments); };

    delete methods.initialize;

    Object.keys(methods).forEach(function(method){
        cls.prototype[method] = methods[method];
    });

    return cls;
}


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

var Animal = new Class({
    initialize: function(nombre, tipo){
        this.nombre = nombre || 'juanito';
        this.tipo = tipo || 'nada';
    },

    getSaludo: function(){
        return 'hola mi nombre es ' + this.nombre + ' y soy un ' + this.tipo;
    }
});

var Perro = new Class(Animal,{
    initialize: function{
        this.nombre = 'albert';
        this.tipo = 'perro';
    },

    ladrar: function(){
        return 'guau guau!!!';
    }
});

var animal = new Animal('kako','animal');
console.log(animal.getSaludo());


module.exports = ConsolidadoController;
