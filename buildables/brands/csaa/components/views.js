$j.build("component")["views"] = {
	/*
		COMPONENT: "views"

		$el.build("views")
	*/
	build: function(data, config) {
		//return $j(this).build("views.block", defined(data, 1), defined(config, {}));
		var $return = $j(this).build("views", defined(data, 1), {
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
				//$return = $j(this);
				if(config.after) {
					config.after.apply($j(this), arguments);
				}

				$j.build("component").views.events.default.apply($j(this), [o]);
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		}).children("wrapper");

		return $return;
	},
	events: {
		// TODO: Meant to hold events dealing specifically with views blocks...should follow object paradigm though
		default: function() {

		}
		/*
			$j.build("component")["views.block"].events.drop_down.apply($j(this), [o]);
		*/
	}
};
