$j.build("component")["code"] = {
	/*
		COMPONENT: "code"

		$el.build("code")
	*/
	build: function(data, config) {
		var $code = $j(this).build("code", defined(data, 1), {
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
					config.after.apply($j(this), arguments);
				}

				if(o.code) {
					Prism.highlightElement($j(this)[0])
				}
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});

		return $code;
	},
	events: {
		// TODO: Meant to hold events dealing specifically with code blocks...should follow object paradigm though
		default: function() {
			// $j(this).on({
			// 	click: function(e) {
			// 		$j.throttle("clickcode", e, 300, function() {
			// 			var instance = $j(this).build("data").instance.data;

			// 			$j.log(instance)
			
			// 			if(instance.on&&instance.on.click) {
			// 				instance.on.click.apply($j(this), [e, instance]);
			// 			}
			// 		});
			// 	}
			// });
		}
		/*
			$j.build("component")["code.block"].events.drop_down.apply($j(this), [o]);
		*/
	}
};
