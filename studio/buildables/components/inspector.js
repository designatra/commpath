import 'jquery';

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
					var duds = [],
						totalDuds = 0;
					$j.each(o.logistics.duds, function(key, value) {
						totalDuds = totalDuds + value;
						duds.push({
							type:key,
							value:value
						})
					});

					var $failures = $j(this).find("wrapper#failures").hide();

					if(totalDuds>0) {
						return $failures
							.show()
							.children("wrapper").build("inspector.failure", duds)
					}
				}
			);
		}
	}
};
