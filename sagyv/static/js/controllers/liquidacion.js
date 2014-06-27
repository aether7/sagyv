App.Controllers.Liquidacion = function(){
    this.empleados = [];
    this.empleadoElegido = null;
    this.cantidad = $("#cantidad");
    this.id = null;
};

App.Controllers.Liquidacion.prototype = {
    constructor: App.Controllers.Liquidacion,
    init: function(){
        var _this = this;

        $("#btn_guardar_liquidacion").on("click",function(){
            _this.guardarLiquidacion();
        });

        $("#btn_actualizar_venta").on("click",function(){
            _this.actualizarVenta();
        });

        this.sugerirEmpleados();
        this.crearBalances();
    },

    showModal: function(id){
        this.id = id;
        this.cantidad.val("");

        $(".has-error").removeClass("has-error");
        $(".help-block").text("");
        $("#modal").modal("toggle");
    },

    actualizarVenta: function(){
        var valido = true,
            inicial = parseInt($("#id_initial_" + this.id).text()),
            actual = $("#id_actual_" + this.id),
            cantidad = parseInt(this.cantidad.val());

        if(!type.isNumber(cantidad)){
            valido = false;
            this.cantidad.siblings("span.help-block").text("Ingrese un número válido");
            this.cantidad.parent().addClass("has-error");
        }else if(cantidad < 1){
            valido = false;
            this.cantidad.siblings("span.help-block").text("Ingrese un número mayor a 1");
            this.cantidad.parent().addClass("has-error");
        }else if(valido && (inicial < cantidad)){
            valido = false;
            this.cantidad.siblings("span.help-block").text("La cantidad no debe exceder al inventario");
            this.cantidad.parent().addClass("has-error");
        }

        if(!valido){
            return;
        }

        actual.parent().
            data("cantidad",this.cantidad.val()).
            attr("data-cantidad", this.cantidad.val());

        actual.text(this.cantidad.val());

        $("#id_gastado_" + this.id).text(inicial - cantidad).data("cantidad");
        $("#modal").modal("toggle");
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
            }
        });
    },

    guardarLiquidacion: function(){
        var json = {
            guia_despacho : parseInt($("#guia_despacho").val()),
            id_trabajador : this.empleadoElegido.id,
            productos : []
        };

        $("[data-producto=true]").each(function(){
            if(parseInt(this.dataset.cantidad) < 1){
                return;
            }

            json.productos.push({
                id : parseInt(this.dataset.id),
                cantidad : parseInt(this.dataset.cantidad)
            });
        });

        json.productos = JSON.stringify(json.productos);

        $.post($("#balance_liquidacion").val(), json, function(data){
            console.log(data);
        });
    }
};
