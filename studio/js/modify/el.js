import * as dj from '../../../core/js/frame.js';

(function($j) {
	var plugin = {
		name: "el",
		methods: {},
		init: false,
		els: {},
		data: {
			loaded: {
				events: false
			}
		}
	};
	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
	};
	plugin.methods.events = function(context) {
		//plugin.data.loaded.events = true;
	};
	/*
		$j.el("epc", "300C75BCD151D40000001CE6")
	*/
	var util = plugin.methods.util = {
		init: function(x, y, z, a) {
			return dj.overload(x, {
				string: function() {
					if(plugin.els[x]) {
						return plugin.els[x].apply(plugin.els.papa(), [y, z, a]);
					}
					return $j();
				},
				object: function() {
					return $j();
				},
				undefinded: function() {
					return $j();
				}
			});

		}
	};

	/*
		Ideally these could created when fragment creates elements
	*/
	var els = plugin.els = {
		papa: function() {
			return $j("body > papa");
		},
		/*
				$j.el("inspector")
	  */
		inspector: function() {
			return els.papa().children("inspector");
		},
		/*
				$j.el("network")[0]
		*/
		network: function () {
			return els.papa().children("#network")
		},
		/*
		    $j.el("timeline")[0]
		*/
		timeline: function () {
			return els.papa().children("#timeline")
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
