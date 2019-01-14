(function($j) {
	var plugin = {
		name: "simulation",
		methods: {},
		init: false,
		data:{},
		timers:{},
		mode:"single"
	};

	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
	};


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
		/*
				$j.simulation("start", "eventInterval", function() {
					$j.studio("updatePath", "digitalComm1")
				});
		*/
		start: function(id, callback) {
			var timer = plugin.timers[id];
			if(timer===undefined) {
				timer = plugin.timers[id] = {};
			} else if(timer===false) {
				//$j.log("Timer Stopped", id);
				plugin.timers[id] = "stopped";
				return false;
			} else if(timer==="stopped") {
				//$j.log("Timer was Stopped. Starting.", id);
			} else if($j.type(timer)==="number") {
				//$j.log("Timer is Running.", id);
			}

			var intervalLength = $j.dice("roll", "eventInterval", "sides6")*1000;
			timer = plugin.timers[id] = setTimeout(function() {
				//$j.log("Timer Interval", id, intervalLength);

				if(callback) {
					callback(id);
				}
				return privates.start(id, callback);
			}, intervalLength);

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
				$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "second");
				$j.simulation("generate", "day", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "minute");

				****  Generating second for a week, will likely create call stack issues so stay away.
				$j.simulation("generate", "week", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "minute");
				$j.simulation("generate", "week", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "hour");
				$j.simulation("generate", "week", "Sun Apr 14 2018 14:32:51 GMT-0700 (Pacific Daylight Time)", "minute");

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
		generate:function(timeperiod, timestamp, intervalUnit) {
			var timestamps = [];

			function generateRange(timestamp) {
				var d = dayjs(timestamp);

				var start = d.startOf(timeperiod),
					end = d.endOf(timeperiod);

				timestamps.push(start);

				var diceMethod = "sides6";
				if(intervalUnit==="second") {
					diceMethod = "complex_2";
				}

				function next() {
					var nextTime = timestamps.fromEnd(1).add($j.dice("roll", "bulkEventGeneration", diceMethod), defined(intervalUnit, 'minute'));

					// If the next random time falls before the time periods end time
					if(!nextTime.isAfter(end)) {
						timestamps.push(nextTime);
						return next(nextTime);
					}

					$j.log("Generation Complete: ", timestamps);
					return false;
				};

				next();
			}

			return generateRange(timestamp);
		}
	};

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
