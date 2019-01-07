$j.build("component").pill = {
	/*
		COMPONENT: "pill"

		$el.build("pill")
	*/
	build: function(data, config) {
		return $j(this).build("pill", data, {
			// TODO: Since adding the extension concept to components, the structure of a component and how it should extend a passed configuration needs  work
			// TODO: Initially was just prototyping code structure but now that I'm on a second component, there is a lot redundancy
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				var $el = $j(this);

				if(config.after) {
					config.after.apply($el, arguments);
				}

				$j.build("component")["pill"].events.default.apply($el, [o]);
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});
	},
	events: {
		default: function() {

		}
	}
};
