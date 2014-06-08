App.Controllers.Bodega = function(){

}

App.Controllers.Bodega.prototype = {
	constructor: App.Controllers.Bodega,
	init: function(){
	
	},

	showModal: function(type_,id){
		$("#"+type_+"_id").val(id);
		$("#"+type_).modal('toggle');
	},

	adquisicion : function(type_){

		var num_fact = $("#factura_add"),
		agregar_stock = $("#cantidad_add"),
		id = $("#modal_add_id").val(),
		valido = true;
		//clear, creo que deberia ir aqui
		num_fact.parent().removeClass("has-error");
		agregar_stock.parent().removeClass("has-error");

		if(num_fact.val().trim() === "" || isNaN(num_fact.val())){
			valido = false;
			num_fact.parent().addClass("has-error");
		}

		if(agregar_stock.val().trim() === "" || isNaN(agregar_stock.val())){
			valido = false;
			agregar_stock.parent().addClass("has-error");
		}

		if(valido){
			$.post("/bodega/agregar_stock_compra/",{"id":id, "num_fact":num_fact.val(), "agregar_stock":agregar_stock.val()}, function(data){
				alert(data);
				
				setTimeout(function(){
					$("#stock_"+id).text(agregar_stock.val());
					$("#"+type_).modal('toggle');
				},2000);
			})
		}
	}


}