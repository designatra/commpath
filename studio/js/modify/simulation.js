(function($j) {
	var plugin = {
		name: "simulation",
		methods: {},
		init: false,
		data:{},
		timers:{},
		mode:"single",
		worker:false,
		cycler:{
			id:null,
			timer:null,
			playing:false
		}
	};

	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
	};

	var requestID;


	var util = plugin.methods.util = {
		init: function(x, y, z, a, b) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x](y, z, a, b);
					}
					// if method name but no private method registered
					// helpful with data calls $j.o("undefinedMethod") would key off data in $j.what()
					return plugin.privates.core()[x];
				},
				object: function() {
					return $j();
				},
				// if no parameters > $j.o()
				undefined: function() {
					return plugin.privates.core();
				}
			});
		}
	};

	/*
		Ideally these could created when fragment creates elements
	*/
	var privates = plugin.privates = {
		core: function() {
			return $j.what();
		},
		/*
				$j.simulation("mode")
				$j.simulation("mode", "single")
				$j.simulation("mode", "accumulate")
		*/
		mode: function(modeID) {
			var mode = plugin.mode;
			if(modeID){
				plugin.mode = modeID;
			}

			if(modeID==="accumulate") {
				$j.studio("resetNodes");
			}

			return plugin.mode;
		},
		/*
				$j.simulation("timers");
		*/
		timers: function() {
			return plugin.timers;
		},
		// Deprecating start
		/*
				$j.simulation("begin")
		*/
		begin: function(maxCount) {
			$j.simulation("mode", "accumulate")
			plugin.cycler.playing = true;
			var i = 0;

			function cycle() {
				var requestID = plugin.cycler.id = requestAnimationFrame(cycle);

				if(plugin.cycler.playing===true) {
					if(i<maxCount) {
						$j.studio("updatePath", "digitalComm1", 3, dayjs().toISOString())
						++i;
					} else {
						$j.simulation("end")
					}
				}
			};
			cycle();
		},
		end: function() {
			plugin.cycler.playing = false;
			// use the requestID to cancel the requestAnimationFrame call
			 cancelAnimationFrame(requestID);
			 return cancelAnimationFrame(plugin.cycler.id)
		},
		/*
				$j.simulation("start", "eventInterval", function() {
					$j.studio("updatePath", "digitalComm1")
				});

				$j.simulation("start", "day", function() {
					$j.studio("updatePath", "digitalComm1")

					$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "second");  >> ~2981

				});
		*/
		start: function(id, callback) {
		  if($j.type(id)==="object") {
		    var sim = id;
		    $j.each(sim.timestamps, function() {
		      if(callback) {
		        callback(this.timestamp);
          }
        })

			  return false;
      }


			var timer = plugin.timers[id];
			if(timer===undefined) {
				timer = plugin.timers[id] = {};
			} else if(timer===false) {
				plugin.timers[id] = "stopped";
				return false;
			} else if(timer==="stopped") {
				//$j.log("Timer was Stopped. Starting.", id);
			} else if($j.type(timer)==="number") {
				//$j.log("Timer is Running.", id);
			}

			var intervalLength = $j.dice("roll", "eventInterval", "sides20")*1000;
			timer = plugin.timers[id] = setTimeout(function() {
				//$j.log("Timer Interval", id, intervalLength);

				if(callback) {
					callback(id);
				}
				return privates.start(id, callback);
			}, intervalLength/100);

			return timer;
		},
		/*
				$j.simulation("stop", "eventInterval");
		*/
		stop: function(id) {
			var timer = plugin.timers[id];
			if(timer) {
				plugin.timers[id] = false;
			}
			return timer;
		},
		/*
				$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "second", function(timestamps) {
						// >> ~2981
						$j.log(timestamps)
				});
				$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "minute");  >> ~411
				$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "hour");    >> ~8

				****  Generating second for a week, will likely create call stack issues so stay away.
				$j.simulation("generate", "week", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "minute"); >> ~2938
				$j.simulation("generate", "week", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "hour");   >> ~52


				$j.simulation("generate", {
						period: "day",                                                                // Duration of time of which random timestamps will be generated
						timestamp: "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)",      // Sample timestamp during the period
						intervalUnit: "minute"	                                                    // Generation coarseness (bigger array with smaller units)
				}, function(map, path) {
						$j.log(map, path)
				});

				DEFs > timeperiod = week
							 intervalUnit = minute

				List of all available units
				---------------------------
				date		        Date of Month
				day	        d	  Day of Week (Sunday as 0, Saturday as 6)
				month	      M	  Month
				year	      y	  Year
				hour	      h	  Hour
				minute	    m	  Minute
				second	    s	  Second
				millisecond	ms	Millisecond
		*/
		generate:function(conf, after) {
			if(plugin.worker===false) {
				plugin.worker = new Worker('js/workers/generate.js');

				if (typeof (Worker) !== "undefined") {
					plugin.worker.onmessage = function (data) {
						return after(data.data.map, data.data.timestamps)
					};
				}
			}

			plugin.worker.postMessage(conf);

			// var d = dayjs(conf.timestamp);
			//
			// var start = d.startOf(conf.period),
			// 	end = d.endOf(conf.period);
			//
			// var map = {};
			// map[start.toISOString()] = 0;
			//
			// var timestamps = new PowerArray([objs.second(start)]);
			//
			// var diceMethod = "sides20";
			// if(conf.intervalUnit==="second") {
			// 	diceMethod = "complex_2";
			// }
			//
			// function next() {
			// 	var nextTime = dayjs(timestamps.fromEnd(1).timestamp).add($j.dice("roll", "bulkEventGeneration", diceMethod), conf.intervalUnit);
			//
			// 	// If the next random time falls before the time periods end time
			// 	if(!nextTime.isAfter(end)) {
			// 		map[nextTime.toISOString()] = timestamps.push(objs.second(nextTime))-1;
			// 		return next();
			// 	}
			//
			// 	if(after) {
			// 		$j.log("DONE Original")
			// 		return after(map, timestamps);
			// 	}
			// };
			//
			// next();
		},
		/*
				TODO: Refactor so it utilizes the more abstract set of functionality found in generate()

				$j.simulation("generateYear", {
						timestamp: "2018-01-02",                                                // Sample timestamp during the period
						intervalUnit: "day"	                                                   // Generation coarseness (bigger array with smaller units)
				}, function(map, timestamps) {
						$j.log(map, timestamps)
				});

				$j.simulation("generateYear", "2018-01-01", function(year, timestamps) {

				})
		*/
		generateYear: function(conf, after) {
			var d = dayjs(conf.timestamp);

			var period = defined(conf.period, "year");

			var start = d.startOf(period),
				end = d.endOf(period);

			var map = {};
      map[start.toISOString()] = 0;

			var timestamps = new PowerArray([objs.day(start)]);

      function next() {
				var nextDay = dayjs(timestamps.fromEnd(1).timestamp).add(1, conf.intervalUnit);

				if(!nextDay.isAfter(end)) {
          map[nextDay.toISOString()] = timestamps.push(objs.day(nextDay))-1;
					return next();
				}

				if(after) {
					return after(map, timestamps);
				}
				return timestamps;
			}

			return next();
		},
    /*
        $j.simulation("updateRange", [start, end], function(sim) {

        })

        $j.o("sim", 2013).get("2013-01-01T08:00:00.000Z")
    */
    updateRange: function(range, after) {
      var sim =  $j.o("sim");

      var start = dayjs(range[0]),
          end = dayjs(range[1]);

      var year = start.year();

      // Does a sim for this year exist
      if(!sim[year]){
	      $j.simulation("generateYear", {
		      timestamp: start,
		      intervalUnit: "day"
	      }, function(map, timestamps) {
		      return $j.o("sim")[year] = {
			      map:map,
			      timestamps:timestamps,
			      /*
                $j.o("sim", 2013).get("2013-01-01T08:00:00.000Z")
                  >>> Returns the Day Object
            */
			      get: function(timestamp) {
				      return this.timestamps[this.map[timestamp]];
			      }
		      };
	      });
      };

      var filteredTimestamps = new PowerArray();
      $j.each(sim[year].map, function(timestamp, index) {
      	var thisDay = dayjs(timestamp);

      	if(thisDay.isSameOrAfter(start)) {
			      if(thisDay.isSameOrAfter(end)) {
				      return false
			      }
			      filteredTimestamps.push(sim[year].get(timestamp))
	      }
      });

      if(after) {
        return after(filteredTimestamps, sim[year]);
      }
    },
		/*
				$j.simulation("distribute", 20382, 4);
		*/
		distribute(amount, branches) {
			var remaining = 100;
			var remainingAmount = amount;

			var distributions = [];

			var step, distribution;
			for (step = 0; step < branches; step++) {
				// First Distibution
				if(step == 0) {
					distribution = $j.dice("roll", "eventInterval", "exploding_1");
					remaining = remaining - distribution;
				} else if(step == (branches-1)) {
					// Last Distribution
					distribution = remaining;
				} else {
					distribution = random([0, remaining])
					remaining = remaining - distribution;
				}

				var distributionAmount;
				if(step == (branches-1)) {
					distributionAmount = remainingAmount;
				} else {
					distributionAmount = Math.floor(remainingAmount*(distribution/100))
					remainingAmount = remainingAmount - distributionAmount;
				}

				distributions.push(distributionAmount);
			}

			return distributions;
		}
	};

	var objs = {
		day:function(timestamp) {
			return {
				timestamp:timestamp.toISOString(),
				paths:new PowerArray()
			}
		},
		second: function(timestamp) {
			return {
				timestamp:timestamp.toISOString(),
				path:new PowerArray()
			}
		}
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name] = function (e) {
		var r = plugin.methods.dom;
		return r[e] ? r[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e && r[e] ? void jQuery.error("Method " + e + " does not exist on jQuery(el)." + plugin.name) : r.init.apply(this, arguments)
	}, jQuery[plugin.name] = function (e) {
		jQuery.isNumeric(e) && (e = parseInt(e));
		var r = plugin.methods.util;
		return r[e] ? r[e].apply(r, Array.prototype.slice.call(arguments, 1)) : "object" == typeof e || !e || !r[e] || plugin.data[e] || jQuery.isNumeric(e) ? r.init.apply(r, arguments) : void jQuery.error("Method " + e + " does not exist on jQuery." + plugin.name)
	};
})(jQuery);
