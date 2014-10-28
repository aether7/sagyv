(function(){
'use strict';

var app = angular.module('guiaApp', []),
    guiaService = require('../services/guia_service.js'),
    terminalService = require('../services/terminal_service.js');

function TerminalController(service){
    this.service = service;

    this.terminal = {};
    this.mensajes = {};
    this.terminales = [];

    this.init();
}

TerminalController.mixin({
    init: function(){
        var _this = this;

        this.service.findAll(function(data){
            _this.terminales = data.terminales;
        });
    },

    mostrarPanel: function(){
        this.terminal = {};
        $('#modal_terminal_agregar').modal('show');
        console.log('mostrando panel');
    },

    agregar: function(){
        var valido = true;

        this.mensajes = {};

        if(!this.terminal.numero){
            this.mensajes.numero = 'campo obligatorio';
            valido = false;
        }else if(isNaN(this.terminal.numero)){
            this.mensajes.numero = 'número inválido';
            valido = false;
        }

        if(!this.terminal.vehiculo){
            this.mensajes.vehiculo = 'campo obligatorio';
            valido = false;
        }

        if(!valido){
            return;
        }

        console.log(this.terminal);
    },

    editar: function(index){
        console.log('editando terminal');
    },

    remover: function(index){
        console.log('removiendo terminal');
    }
});

app.factory('guiaService', guiaService);
app.factory('terminalService', terminalService);


app.controller('TerminalController', ['terminalService', TerminalController]);
})();
