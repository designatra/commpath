$j.build("package")["field.email"] = [
	{
		type:"email",
		id:"email",
		label:"email",
		error:{
			message:"Enter a valid email address"
		},
		contextual:{
			help:{
				type:"contextual-help",
				message:"A <b>properly formatted</b> email is required to login."
			}
		}
	},
	function(data, o) {
		// refers to the data in the previous object (^ above ^)
		if(o.contextual) {
			$j(this).attr("contextual-help", "off");
		}

		$j(this)
			.children("wrapper#input").build("icon.contextual-help")
			.build("message", data.contextual);
	
		return $j(this);
	}
];
