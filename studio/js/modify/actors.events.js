/*
	supports plugin > actors.js

	Event registery holding events that possibly get bound to a chained $j(this)

	$j(this).actors({
		type:"links"
	});
*/
$j.actors("register", {
	network: function(e) {
		var $inspector = $j(this);

		$j.what("network").network.on("click", function (e) {
			var node = $j.o("node", this.getNodeAt(e.pointer.DOM));

			var entity = node.entity;
			if(!entity) {
				return false;
			}

			var application = $j.o("application", entity.id);

			$inspector.build("inspector.content", {
				title:application,
				logistics:node.logistics
			})
		});
	},
	timeline: function(e) {
		var t = $j.o("timeline"),
				timeline = t.timeline;
		var weeks = {};

		timeline.on("rangechanged", function (e) {
			$j.throttle("buildingPaths", e, 1000, function() {
				var calcs = {
					failure:0,
					success:0
				};

				var visibleItems = timeline.getVisibleItems();

				visibleItems.forEach(function(itemID) {
					var item = t.data.get(itemID);
					calcs[item.group] = calcs[item.group] + parseInt(item.content);
				});

				var distributions = {
					success: $j.simulation("distribute", calcs.success, 4),
					failure: $j.simulation("distribute", calcs.failure, 4)
				}

				//$j.simulation("begin", distributions.success[0])
			})
		});
	},
	simulation:function(e) {
		$j(this).on({
			click: function() {
				$j(this).trigger($j(this).attr("id"));
			},
			play: function() {
				$j.simulation("mode", "accumulate")
				$j.simulation("start", "eventInterval1", function() {
					$j.studio("updatePath", "digitalComm1")
				});
			},
			stop: function() {
				$j.simulation("stop", "eventInterval1")
			},
			reset: function() {
				$j.studio("resetNodes");
			}
		}, "action")
	}
});
