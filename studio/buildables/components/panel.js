$j.build("component").panel = {
	/*
		COMPONENT: "panel"

		$el.build("panel", {
			title:"credit card"
		})
	*/
	build: function(data, config) {
		data = data[0];
		var $panels = $j(this);
		
		$panels.build("panel", data.panel, function() {
			$j(this).build("tabs", 1, function() {
				var $els = $j(this);

				$els.filter("tabs").build("tab", data.tabs, function() {
					$j(this).closest("tabs").actors({
						type:"tabs"
					});
				});
				$els.filter("#tab-body").build("wrapper.tbody", data.tabs, {
					after: function(i, o) {
						if(o.element) {
							$j(this)
								.children("control").remove()
								.end().build(o.element);
						}
					},
					completed: function(o) {
						
					}
				});
			});

			if(config.after) {
				config.after.apply($j(this))
			}
		});
			
		return $panels;
	}
};


/*
$j(this)
	.build("panel", data, {
		after: function(i, o) {	
			
		},
		events:{
			after:[
				{
					name:"field"
				}
			]
		}
	})
*/
