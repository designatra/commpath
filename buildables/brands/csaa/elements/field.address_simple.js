$j.build("package")["field.address-simple"] = [
	{
		type:"address-street",
		id:"addressStreet",
		label:"Street Address",
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
	}
];
