$j.build("package")["field.phone-numbers"] = [
	{
		type:"phone",
		id:"mobile",
		label:"mobile",
		mask:"(555) 555 5000",
		error:{
			message:"Enter a valid mobile phone number"
		}
	},
	{
		type:"phone",
		id:"home",
		label:"home",
		mask:"(555) 555 5000",
		error:{
			message:"Enter a valid home phone number"
		}
	},
	{
		type:"phone",
		id:"work",
		label:"work",
		mask:"(555) 555 5000",
		error:{
			message:"Enter a valid work phone number"
		}
	}
];
