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

		// timeline.on("rangechange", function (e) {
		// 	$j.log("rangechange", e)
		// });
		timeline.on("rangechanged", function (e) {
			$j.simulation("updateRange", [e.start, e.end], function(filteredTimestamps, sim) {
				var days = filteredTimestamps//sim.timestamps;
$j.log(days)
				// $j.each(days, function(i, day) {
				// 	//ß$j.log("DAY", day.paths.length)
				// 	var paths = day.paths;
				// 	if(paths.length<1) {
				// 		$j.simulation("generate", {
				// 			period: "day",                                                                // Duration of time of which random timestamps will be generated
				// 			timestamp: day.timestamp,      // Sample timestamp during the period
				// 			intervalUnit: "minute"	                                                    // Generation coarseness (bigger array with smaller units)
				// 		}, function(map, timestamps) {
				// 			// GENERATE path for each timestamp (~410 timestamps per day)
				// 			day.paths = timestamps;
				// 		});
				// 	}
				// });
			})

      // $j.simulation("updateRange", [e.start, e.end], function(sim) {
	    //   $j.simulation("mode", "accumulate")
	    //   $j.simulation("start", $j.o("sim", 2013), function(timestamp) {
		  //     $j.studio("updatePath", "digitalComm1", undefined, timestamp)
	    //   });
      // })
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
