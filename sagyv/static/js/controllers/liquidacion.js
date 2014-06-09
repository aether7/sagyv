App.Controllers.Liquidacion = function(){
    this.empleados = [];
    this.empleadoElegido = null;
};

App.Controllers.Liquidacion.prototype = {
    constructor: App.Controllers.Liquidacion,
    init: function(){
        this.sugerirEmpleados();
        this.crearBalances();
    },

    sugerirEmpleados: function(){
        var _this = this,
            empleadosSuggest;

        empleadosSuggest = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("nombre_completo"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(this.empleados,function(empleado){ return empleado; })
        });

        empleadosSuggest.initialize();

        $("#busca_trabajador").typeahead({
            hint: true,
            highlight: true,
            minLength: 3
        },{
            name: 'nombreEmpleados',
            displayKey: 'nombre_completo',
            source: empleadosSuggest.ttAdapter()
        });

        $("#busca_trabajador").on("typeahead:selected",function(){
            _this.seleccionarTrabajador($(this).val());
        });
    },

    crearBalances: function(){

    },

    addTrabajador: function(trabajador){
        var trabajadorJson = JSON.parse(trabajador.replace(/&quot;/g, '"'));
        this.empleados.push(trabajadorJson);
    },

    seleccionarTrabajador: function(nombreTrabajador){
        var _this = this;

        this.empleados.forEach(function(trabajador){
            if(trabajador.nombre_completo === nombreTrabajador){
                _this.empleadoElegido = trabajador;
                $("#guia_despacho").val(_.random(1000,3500));
            }
        });
    }
};
