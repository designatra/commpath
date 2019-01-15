(function($j) {
	// http://rpg.greenimp.co.uk/dice-roller/
	var plugin = {
		name: "dice",
		methods: {},
		init: false,
		dice:{},
		formats: {
			sides6:"d6",// or 1d6 (A 6 sided die)
			sides6x2:"2d6",// (Two 6 sided dice)
			sides20:"d20",
			sides6plus4: "1d6+4", //(Roll a 6 sided dice and add 4 to the result)
			complex_1: "2d10*4+1d20", //(Roll two 10 sided dice multiply by four, and roll one 20 sided die)
			complex_2: "2d10+4+2d20-L", //(Roll two 10 sided dice add four, and roll two 20 sided die, taking away the lowest of the two)
			percent: "d%", //(A percentile die - equivalent to d100)
			// dF or dF.2 (A standard fudge dice - 2 thirds of each symbol)
			// dF.1 (A non-standard fudge dice - 1 positive, 1 negative, 4 blank)
			// 2d6! (Exploding dice - two 6 sided die, rolling again for each roll of the maximum value)
			// 2d6!! (Exploding & compounding dice - like exploding, but adding together into single roll)
			// 2d6!p (Penetrating dice - like exploding, but subtract 1 from each consecutive roll)
			// 2d6!!p (Penetrating & compounding dice - like exploding & compounding, but subtract 1 from each consecutive roll)
			exploding_1: "2d6!>=4" //(Exploding dice, but only if you roll a 4 or greater - Also usable with compounding and penetrating dice)
			// 2d6>4 (Dice pool - anything greater t
		}
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
				$j.dice("roll", "eventInterval", "sides6")
		*/
		roll: function(id, format) {
				var die = plugin.dice[id];
				if(!die) {
					die = plugin.dice[id] = new DiceRoller();
				}
				die.roll(plugin.formats[format]);
				return die.log.shift().total;
		},
		formats: function() {

		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
