$j.build("package")["field.bank"] = [
	{
		type:"bank-accountHolder",
		id:"bankAccountHolder",
		label:"Name of Account Holder",
		mask:"John Doe",
		error:{
			message:"Enter full name"
		}
	},
	{
		type:"bank-account",
		id:"bankAccount",
		label:"Account Number",
		mask:"###############",
		help:{
			message:""
		},
		error:{
			message:"Enter 15 Numbers"
		}
	},
	{
		type:"bank-routing",
		id:"bankRouting",
		label:"Routing Number",
		mask:"#########",
		help:{
			message:""
		},
		error:{
			message:"Enter 9 Numbers"
		}
	}
];
