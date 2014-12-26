function BoletaController(){
    this.boletas = [
        {
            id: 1,
            inicial: 1,
            ultima: 50,
            actual: 20,
            trabajador: {
                id: 3,
                nombre: "alberto"
            }
        },
        {
            id: 2,
            inicial: 51,
            ultima: 100,
            actual: 60,
            trabajador: {
                id: 2,
                nombre: "juanito"
            }
        },
        {
            id: 3,
            inicial: 101,
            ultima: 200,
            actual: 125,
            trabajador: {
                id: 3,
                nombre: "mauricio"
            }
        }
    ];

    this.boleta = null;
}

BoletaController.mixin({
    mostrarPanel: function(nombre, index){
        this['_' + nombre](index);
    },

    _nuevo: function(){
        console.log('nueva boleta');
    },

    _editar: function(index){
        console.log('editar boleta');
    },

    eliminar: function(index){
        if(!confirm('¿Está seguro(a) de que desea realizar esta acción?')){
            return;
        }

        this.boletas.splice(index, 1);
        common.agregarMensaje('El talonario fue eliminado exitosamente');
    }
});

module.exports = BoletaController;
