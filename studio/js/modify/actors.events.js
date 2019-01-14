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
		var timeline = $j.what("timeline").timeline;

		timeline.on("rangechange", function (e) {
			$j.log("rangechange", e)
		});
		timeline.on("rangechanged", function (e) {
			$j.log("rangechanged", dayjs(e.start), dayjs(e.end), e)

		});
		timeline.on("timechange", function (e) {
			$j.log("timechange", e)
		});
		timeline.on("timechanged", function (e) {
			$j.log("timechanged", e)
		});
		timeline.on("click", function (e) {
			$j.log("click", e)
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
