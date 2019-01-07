$j.build("package")["field.select.expanded_deductible"] = [
	{
		id:"deductible_amount",
		label:"Decline",
		config: {
			closeOnSelect:false,
			selectOnClose: false,
			preventClosing:true,
			autoOpen:true
		},
		options:[
			{
				label:"Decline",
				value:"Devline"
			},
			{
				label:"$100"
			},
			{
				label:"$250"
			},
			{
				label:"$500"
			},
			{
				label:"$750"
			},
			{
				label:"$1K"
			}
		]
	}
	// function(data, config) {
	//
	// }
];