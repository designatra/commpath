$j.build("package")["field.address-financier"] = [
	{
		type:"bank-accountHolder",
		id:"financier_name",
		label:"Name of Financier",
		mask:"ACME Holdings",
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
					label:"Remove Additional Financial Interest"
				},
				{
					id:"add_interest",
					label:"Add Additional Financial Interest"
				}
			]);
		});

		return $j(this);
	}
];
