$j.build("component").table = {
	/*
		COMPONENT: "panel"

		$el.build("panel")
	*/
	build: function(data, config) {
		
	},
	row: {
		build: function(data, config) {
			var $row = $j(this).build("table.row", data, {
				populate: defined(config.populate, function() {}),
				after: function(i, o) {
					$j.build("component").table.row.events.apply($j(this), [o]);

					if(config.after) {
						config.after.apply($j(this), [o]);
					}
				}
			});
			
			return $row.children("wrapper");
		},
		events: function() {
			
		}
	},
	column: {
		build: function(data, config) {
			var $column = $j(this).build("table.column", data, {
				populate: defined(config.populate, function() {}),
				after: function(i, o) {
					$j.build("component").table.column.events.apply($j(this), [o]);

					if(config.after) {
						config.after.apply($j(this), [o]);
					}
				}
			});
			
			return $column.children("wrapper");
		},
		events: function() {
			
		}
	},
	events: {
		// example: function() {
			
		// }
	}
};
