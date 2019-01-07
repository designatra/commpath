$j.build("package")["field.address"] = [
	{
		type:"address-street",
		id:"addressStreet",
		label:"Street Address",
		error:{
			message:"Enter a valid address"
		}
	},
	{
		type:"address-city",
		id:"addressCity",
		label:"City",
		error:{
			message:"Enter a valid city"
		}
	},
	{
		type:"address-state",
		id:"addressState",
		label:"State",
		error:{
			message:"Enter a valid state"
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
	}
];
