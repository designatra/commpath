(function($j) {
	var plugin = {
		name: "simulation",
		methods: {},
		init: false,
		data:{},
		timers:{}
	};

	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
	};


	var util = plugin.methods.util = {
		init: function(x, y, z) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x](y, z);
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
				$j.simulation("timers");
		*/
		timers: function() {
			return plugin.timers;
		},
		/*
				$j.simulation("start", "eventInterval");
		*/
		start: function(id) {
			var timer = plugin.timers[id];
			if(timer===undefined) {
				timer = plugin.timers[id] = {};
			} else if(timer===false) {
				$j.log("Timer Stopped", id);
				plugin.timers[id] = "stopped";
				return false;
			} else if(timer==="stopped") {
				$j.log("Timer was Stopped. Starting.", id);
			} else if($j.type(timer)==="number") {
				$j.log("Timer is Running.", id);
			}

			var intervalLength = $j.dice("role", "eventInterval", "sides6")*1000;
			timer = plugin.timers[id] = setTimeout(function() {
				$j.log("Timer Interval", id, intervalLength);

				return privates.start(id);
			}, intervalLength);

			return timer;
		},
		interval: function(id) {
			plugin.timers[id] = setTimeout(function() {
				$j.log("Timer Interval", id, intervalLength);

				return $j.simulation("start", id);
			}, intervalLength);
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
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
