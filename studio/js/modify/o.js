(function($) {
	var plugin = {
		name: "o",
		methods: {},
		init: false,
		els: {},
		data: {
			loaded: {
				events: false
			}
		}
	};

	var dom = plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		}
	};

	/*
		$j.o("privateMethod", o)
	*/
	var util = plugin.methods.util = {
		init: function(x, y, z, a) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x].apply(plugin.privates.core(), [y, z, a]);
					}
					return plugin.privates.core()[x];
				},
				object: function() {
					//return $j();
				},
				undefinded: function() {
					return plugin.privates.core()[x];
				}
			});

		}
	};

	var privates = plugin.privates = {
		core: function() {
			return $j.what();
		},
		/*
				$j.o("network");
		 */
		network: function() {
			return privates.core().network;
		},
		/*
				$j.o("nodes");
		 */
		nodes: function() {
			return privates.network().nodes;
		},
		/*
				$j.o("node", "b0186417-dde8-d321-4b14-4ab8d709e233");
		*/
		node: function(id) {
			var nodes = $j.what("maps").nodes.by.id,
				node = nodes[id];

			if(node) {
				return node;
			}
			return false;
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
