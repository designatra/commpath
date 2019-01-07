(function($j) {
	var plugin = {
		name: "studio",
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
					$j(el).studio()
				*/
				undefined: function() {
					return privates.data($j(this));
				}
			}, $j(this));
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
		}
		/*
			private.data($field);
		*/
		// data: function($el) {
		// 	var data = $el.data("field");
		// 	if(!data) {
		// 		data = $el.data("field", {});
		// 	}
		// 	return data;
		// }
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
