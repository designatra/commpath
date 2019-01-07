$j.build("component")["action"] = {
	/*
		COMPONENT: "action"

		$el.build("action")
	*/
	build: function(data, config) {
		//return $j(this).build("action.block", defined(data, 1), defined(config, {}));
		$j(this).build("action", defined(data, 1), {
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
				if(config.after) {
					return config.after.apply($j(this), arguments);
				}
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});
	},
	events: {
		// TODO: Meant to hold events dealing specifically with action blocks...should follow object paradigm though
		default: function() {
			$j(this).on({
				click: function(e) {
					$j.throttle("clickAction", e, 300, function() {
						var instance = $j(this).build("data").instance.data;

						$j.log(instance)
			
						if(instance.on&&instance.on.click) {
							instance.on.click.apply($j(this), [e, instance]);
						}
					});
				}
			});
		}
		/*
			$j.build("component")["action.block"].events.drop_down.apply($j(this), [o]);
		*/
	}
};
