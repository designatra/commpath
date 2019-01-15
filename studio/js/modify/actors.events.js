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
		var weeks = {};

		timeline.on("rangechanged", function (e) {
			$j.throttle("buildingPaths", e, 1000, function() {
				$j.simulation("updateRange", [e.start, e.end], function(filteredTimestamps, sim) {
					var days = new PowerArray(filteredTimestamps);

					days.forEach(function(day){

						// NOTE: Big issues here with variable bleeding into microierations (while iterating over a year of days, single timestamp is held constant)
						// var paths = day.paths;
						//
						// if(paths.length<1) {
						// 	$j.simulation("generate", {
						// 		period: "day",                                                                // Duration of time of which random timestamps will be generated
						// 		timestamp: day.timestamp,      // Sample timestamp during the period
						// 		intervalUnit: "second"	                                                    // Generation coarseness (bigger array with smaller units)
						// 	}, function(map, timestamps) {
						// 		day.paths = timestamps;
						//
						// 		var timestamp = dayjs(day.timestamp);
						//
						// 		var week = {
						// 			start:timestamp.startOf("week"),
						// 			end:timestamp.endOf("week")
						// 		}
						// 		week.id = week.start.toISOString()+week.end.toISOString();
						//
						// 		if(weeks[week.id]===undefined) {
						// 			weeks[week.id] = {
						// 				id:week.id,
						// 				start:week.start.format("YYYY-MM-DD"),
						// 				end:week.end.format("YYYY-MM-DD"),
						// 				paths:0
						// 			};
						// 		}
						// 		weeks[week.id].paths=weeks[week.id].paths+day.paths.length;
						// 	});
						// }
					});

					// var timelineData = [];
					// $j.each(weeks, function(id, week) {
					// 	week.content = week.paths.length;
					// 	timelineData.push(week)
					// })
					// $j.what("timeline").data.update(timelineData);
				});
			})
		  //    $j.studio("updatePath", "digitalComm1", undefined, timestamp)
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
