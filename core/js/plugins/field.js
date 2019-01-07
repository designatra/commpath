(function($j) {
	var plugin = {
		name: "field",
		methods: {},
		init: false,
		data: {}
	};
	
	plugin.methods.dom = {
		init: function(x) {
			return overload(x, {
				string: function() {
					
				},
				object: function() {
					
				},
				/*
					$j(field).field()

					Returns field data
					> IF no data, inits empty object, and returns it
				*/
				undefined: function() {
					return privates.data($j(this));
				}
			}, $j(this));
		},
		/*			
			$field.field("input")
			
			Returns value of native input $element inside of a field
		*/
		input: function(val) {
			return privates.input($j(this), val)
		},
		/*
			$field.field("$input")
			
			Returns native input $element inside of a field
			> IF input is passed, will return itself
			TODO: Duplicates method in validate > migrate to field plugin
		*/
		$input: function() {
			return privates.$input($j(this))
		},
		update: function(val) {
			return $j(this)
				.field("input", val)
				.trigger("validate");
		},
		/*
			$field.field("feature")
			$field.field("feature", "contextual-help")
		*/
		// feature: function(name) {
		// 	var features = $j(this).field().features;
		// 	if(!features) {
		// 		return {};
		// 	}
		// 	if(!name) {
		// 		return features;
		// 	}
		// 	return features[name];
		// },
		/*
			$field.field("format")

			TODO: Migrate functionality to paramaterized private method
		*/
		format: function() {
			var o = privates.data($j(this));
			if(o.format) {
				var formattedVal = $j.field("format", o.format, $j(this).field("input"));
				// IF value is invalid for some reason (which it shouldn't because it should have already been validated)
				if(!formattedVal) {
					// THEN return DOM context without changing original value since we don't want contradiction between validator (1st line) and formatter
					return $j(this);
				}
				// OTHERWISE update the inputs value with the formatted value
				return $j(this).field("$input").val(formattedVal).end();
			}
			return $j(this);
		}
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
			private.data($field);
		*/
		data: function($el) {
			var data = $el.data("field");
			if(!data) {
				data = $el.data("field", {});
			}
			return data;
		},
		/*
			$j.field("format", "$amount", 124.00)
			privates.format("$amount", 124.00)

			TODO: Consider sending array for piping formatters
		*/
		format: function(name, x) {
			var formatter =formatters[name];
			if(!formatter) {
				return false;
			}
			return formatter(x);
		},
		/*
			Return input or searches for input and return it
			privates.$input($j("#email"))
		*/
		$input: function($el) {
			var $input = $el;
			if(!$input.is("input")) {
				$input = $el.find(":input:first");
			}
			return $input;
		},
		/*
			Return input value or searches for input and returns its value
			privates.input($j("#email"))
		*/
		input: function($el, val) {
			var $input = privates.$input($el);
			if(val===undefined) {
				return $input.val();
			}
			return $input.val(val);
		}
	};

	var formatters = plugin.formatters = {
		/*
			formatters.$amount(124.00)
		*/
		$amount:function(amount) {
			// Adding the dollar sign seperatly from the actual value
			// return accounting.formatMoney(amount);
			return accounting.formatMoney(amount, "", 2);
		},
		/*
			formatters.creditCard("4234123412341234")

			TODO: Improve functionality by referencing formance among others
		*/
		"cc-number":function(num) {
			var cc = num.replace(/ /g, "").split("");
			var spacesAt = [4,9,14];
			$j.each(spacesAt, function(i, where) {
				cc.splice(where, 0, " ");
			})
			return cc.join("");
		}
	}


	/*
		interaction.velocity("keyup", timeStamp, $el)
	*/
	/*
	var interaction = {
		events: {
			all:{},
			click: {},
			keyup:{},
			change:{}
		},
		velocity:function(type, timeStamp, $el) {
			var events = interaction.events;

			// since each element needs to track interaction seperatly, we are going to store a unique id
			// we probably should just store interaction object and it's event registry on element
			var o = $el.data("interaction");
			if(!o) {
				o = $el.data("interaction", {
					id:guidGenerator()
				});
			}
			var id = o.id;
			
			// unconditionally register all event timestamps (just in case)
			var allTimeStamps = events.all[id];
			// If no events have EVER been registered
			if(!allTimeStamps) {
				allTimeStamps = events.all[id] = newTimeStampArray(timeStamp)
			} else {
				allTimeStamps.push(timeStamp);
			}
			
			var timeStamps = events[type][id];
			if(!timeStamps) {
				timeStamps = events[type][id] = newTimeStampArray(timeStamp);
			} else {
				timeStamps.push(timeStamp);
			}
			
			// Grab the last two registered timestamps
			var recentEvents = timeStamps.fromEnd(2);
			// Calculate time between (elapsed time)
			var timeBetween = recentEvents[1]-recentEvents[0];

			//$j.log(timeBetween)

			// Creates new array to track timeStamps
			// To prevent nAn & 0 elapsed time, init with the timeStamp x2
			function newTimeStampArray(timeStamp) {
				return new Array(timeStamp, timeStamp+1);
			}
		},
		track: function() {

		}

	}
	*/

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
