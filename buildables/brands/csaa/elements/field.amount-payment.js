$j.build("package")["field.amount-payment"] = [
	{
		type:"$amount",
		id:"amount-payment",
		label:"Payment Amount",
		format:"$amount",
		error:{
			message:"Enter a payment amount"
		},
		clearable:true
	},
	// data comes from previous object (above) ^^^
	function(data, o) {
		if(o.clearable && o.clearable!==true) {
			return false;
		}
		
		// $j(this)
		// 	.attr("clearable", true)
		// 	.build("icon.close-fill");

		$j(this)
			.children("wrapper#input").prepend("<b id='symbol'>&#36</b>")
			.build("icon.clear-field");
			
		return $j(this);
	}
];
