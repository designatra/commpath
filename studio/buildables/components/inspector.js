$j.build("component")["inspector"] = {
	/*
		COMPONENT: "inspector"

		$el.build("inspector")
	*/
	build: function (data, config) {
		var inspector = $j(this).build("inspector", defined(data, 1), {
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

		return inspector;
	},
	/*
		$j.build("component")["inpspector.context"].events.default.apply($j(this), [o]);
	*/
	events: {
		default: function () {

		}
	},
	/*
		$j.el("inspector").build("inspector.content", {
			title:"SOA",
			logistics:{
        in:458,
        out:274,
        duds:{
          biz:184,
          it:0,
          planned:0
        }
      }
		})
	*/
	"content": {
		build: function (data, config) {
			return $j(this)
				.empty()
				.build("inspector.body", data, function (i, o) {
					var duds = [];
					$j.each(o.logistics.duds, function(key, value) {
						duds.push({
							type:key,
							value:value
						})
					})
					$j(this).find("wrapper#failures > wrapper").build("inspector.failure", duds)
				}
			);
		}
	}
};
