var Guia = require('../../models/guias/guia_model.js');

function GuiaController(){
    this.guias = [];
}

GuiaController.mixin({
    init: function(){

    }
});

module.exports = GuiaController;
