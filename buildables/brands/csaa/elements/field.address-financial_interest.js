$j.build("package")["field.address-financial_interest"] = [
	{
		type:"bank-accountHolder",
		id:"financial_interest_name",
		label:"Name of Additional Financial Interest",
		mask:"ACME Bank",
		error:{
			message:"Enter full name"
		}
	},
	{
		type:"address-street",
		id:"addressStreet",
		label:"Street Address or PO Box",
		error:{
			message:"Enter a valid address"
		}
	},
	{
		type:"address-zip",
		id:"addressZip",
		label:"Zip Code",
		mask:"12345",
		error:{
			message:"Enter a valid zip"
		}
	},
	function(data,o) {
		var $view = $j(this).closest("views");

		$view
			.children("action")
			.filter("#add_interest, #remove_interest").remove();

		// TODO: Fix Packages builder so last item fires after element before is build (when function is firing slightly before last item is built)
		$view.oneTime(1, function() {
			$j(this).build("action", [
				{
					id:"remove_interest",
					label:"Remove Additional Financial Interest",
					on:{
						click: function(e) {
							$j(this).trigger("interest.remove");
						}
					}
				},
				{
					id:"add_interest",
					label:"Add Additional Financial Interest",
					on:{
						click: function(e) {
							$j(this).trigger("interest.add");
						}
					}
				}
			]);
		});

		return $j(this);
	}
];
