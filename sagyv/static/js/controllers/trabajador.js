App.Controllers.Trabajador = function(){

};

App.Controllers.Trabajador.prototype = {
    constructor: App.Controllers.Trabajador,

    init: function(){
        $("#btn_nuevo_trabajador").on("click", function(){
            common.mostrarModal("nuevo");
        });
    },

    guardarNuevo: function(){

    },

    validarCampos: function(){

    }
};
