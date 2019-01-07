$j.build("package")["field.fullName"] = [
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
			},
			{
				totalWords:2
			}
		],
		error:{
			message:"Enter a FIRST and LAST name"
		}
	}
];
