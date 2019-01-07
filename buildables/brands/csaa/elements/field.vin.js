$j.build("package")["field.vin"] = [
	{
		type:"vin",
		id:"vin",
		label:"Vehicle Identification Number (VIN)",
		help: {
			message:"The VIN can be found on your vehicle registration or car interior."
		},
		error:{
			message:"Enter a valid VIN",
			type:"error"
		}
	}
];
