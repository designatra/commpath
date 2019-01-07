$j.build("package")["field.creditCard"] = [
	{
		type:"cc-name",
		id:"ccName",
		label:"Name on Card",
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
		type:"cc-number",
		id:"ccNumber",
		label:"Credit Card Number",
		format:"cc-number",
		error:{
			message:"Enter a valid credit card number"
		}
	},
	{
		type:"cc-zip",
		id:"ccZip",
		label:"Zip Code",
		mask:"12345",
		error:{
			message:"Either be 5 or 9 numbers"
		}
	},
	{
		type:"cc-date",
		id:"ccDate",
		label:"Expiration",
		mask:"MM/YYYY",
		error:{
			message:"Invalid"
		}
	}
];
