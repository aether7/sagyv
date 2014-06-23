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

    showModal: function(id){
        $("#cantidad").val('');
        $("#id_obj").val(id);
        $("#modal").modal('toggle');
    },

    guardar: function(){
        var cantidad = parseInt($("#cantidad").val().trim()), 
            id = $("#id_obj").val(), 
            flag = true,
            total = parseInt($("#id_initial_"+id).text()), // - parseInt($("#id_gastado_" + id).text());
            cantidadActual = parseInt($("#id_actual_"+id).text())
        
        if( isNaN(cantidad) ){
            flag = false;
            msj_error = "Ingrese un numero";
        }
        
        if( ( total < cantidad) && flag ){
            flag = false;
            msj_error = "La cantidad es muy alta";
        }
        cantidadActual = cantidad + cantidadActual;
        resta = total - cantidadActual;
            
        if(flag){
            $("#id_actual_" + id).text(cantidadActual);
            $("#id_gastado_" + id).text(total - cantidadActual);
            $("#modal").modal('toggle');
        }else{
            alert(msj_error);
        }
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
