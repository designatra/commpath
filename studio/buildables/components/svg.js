$j.build("component")["svg"] = {
	/*
		COMPONENT: "svg"

		$el.build("svg")
	*/
	build: function (data, config) {
		var svg = $j(this).build("svg", defined(data, 1), {
			events: function () {
				if (config.events) {
					return config.events;
				}
			},
			populate: function (i, o) {
				if (config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function (i, o) {
				if (config.after) {
					config.after.apply($j(this), arguments);
				}

			},
			completed: function (o) {
				if (config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});

		return svg;
	},
	/*
		$j.build("component")["menu.context"].events.default.apply($j(this), [o]);
	*/
	events: {
		default: function () {

		}
	},
	/*
			$j.el("papa").children()
				.build("svg.node", {
					name:"michael",
					dog:"lucy",
					dims: {
						height:70,
						width:300
					}
				})
				.css({
					position:"absolute",
					top:"10%",
					left:"50%",
					marginLeft:"-150px"
				});

	*/
	"node": {
		build: function (data, config) {
			return $j(this).build("svg", function () {
				return $j(this).find("foreignObject").build("svg.body", data, function () {
					var $body = $j(this);

					if (config.after) {
						 config.after.apply($body, [data]);
					}
					return $body;
				})
			})
		}
	}
}
