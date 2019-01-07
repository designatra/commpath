$j.build("package")["field.contactInfo"] = [
	{
		type:"name-full",
		id:"nameFull",
		label:"Full Name",
		mask:"John Doe",
		rules: [
			{
				minLength:3
			},
			{
				maxLength:40
			}
		],
		error:{
			message:"Enter a valid name"
		}
	},
	{
		type:"phone",
		id:"phone",
		label:"phone",
		mask:"(555) 555 5000",
		error:{
			message:"Enter a valid phone number"
		}
	},
	{
		type:"email",
		id:"email",
		label:"email",
		error:{
			message:"Enter a valid email address"
		}
	}
];
