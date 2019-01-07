$j.build("component")["view"] = {
	/*
		COMPONENT: "view"

		$el.build("view")
	*/
	build: function(data, config) {
		var $return = $j(this).build("view", defined(data, 1), {
			events: function() {
				if(config.events) {
					return config.events;
				}
			},
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				// If there are more than 1 view, (could get rucursive)
				// inform the drawer so navigation can be added to the drawer's footer
				var view_count = $j(this).siblings("view").addBack().length
				$j(this).closest("drawer").attr("views", view_count);

				if(config.after) {
					config.after.apply($j(this), arguments);
				}

				$j.build("component").view.events.default.apply($j(this), [o]);
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		}).find(">wrapper>wrapper");

		return $return;
	},
	events: {
		default: function() {

		}
	}
};
