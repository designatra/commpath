$j.build("package")["field.date-payment"] = [
	{
		type:"date",
		id:"date-payment",
		label:"payment date",
		mask:"MM / DD / YYYY",
		error:{
			message:"Enter a valid date"
		}
	},
	function(data, o) {
		$j(this).children("wrapper#input").build("icon.datepicker");
		$j(this).field("$input").datepicker({
			showOtherMonths: true,
			selectOtherMonths: true,
			minDate: 0,
			maxDate: "+6M +10D",
			showOn: "button",
			showAnim:"",
			// buttonImage: "",
   //          		buttonImageOnly: false,
            		hideIfNoPrevNext: true,
            		// showButtonPanel:true,
			nextText:"",
			prevText:"",
			beforeShow: function($input, obj) {
				// $j(this).closest("field").attr("datepicker", "visible");
			},
			onSelect: function(str, o) {
				$j(this).closest("field").attr("datepicker", "hidden");
				$j(this).trigger("keyup");		
			},
			onClose: function(str, o) {
				//$j(this).closest("field").attr("datepicker", "hidden");
			}
		});

		return $j(this);
	}
];
