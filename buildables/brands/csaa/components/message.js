$j.build("component").message = {
	/*
		COMPONENT: "message"

		$el.build("message", {
			type:"contextual-help",
			message:"A properly formatted email is required to login."
		})
	*/
	build: function(data, config) {
		return $j(this)
			.build("message", data, defined(config, {}))
			.parent();
	}
};
