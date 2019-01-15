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
				$j.o("vis");
				$j.o("vis", "nodes");
				$j.o("vis", "edges");
		*/
		vis:function(what) {
			var vis = privates.core().vis;
			if(!what) {
				return vis;
			}
			return vis[what];
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
		},
		/*
			$j.o("edges")
		*/
		edges: function() {
			return privates.network().edges;
		},
		/*
			$j.o("paths");
		*/
		paths: function() {
			return privates.network().paths;
		},
		/*
			$j.o("path", "digitalComm1", 1);
		*/
		path: function(id, index) {
			return privates.paths()[id][index-1];
		},
		/*
				$j.o("entities")
		*/
		entities: function() {
			return privates.core().dictionary;
		},
		/*
				TODO: Create for each entity type

				$j.o("application", 1);
		*/
		application:function(id) {
			return privates.entities().application[id].label;
		},
		/*
				$j.o("communications")
		*/
		communications: function() {
			return privates.core().communications;
		},
		/*
				$j.o("colors")
		*/
		colors: function() {
			return privates.core().dictionary.colors;
		},
		/*
				$j.o("color", "red_1")
		*/
		color: function(id) {
			return privates.colors()[id];
		},
		/*
				Shortcut for simulation data

				$j.o("sim")
				$j.o("sim", 2013)

				$j.o("sim", 2013).get("2013-01-01T08:00:00.000Z")
		*/
		sim: function(year) {
			var sim = privates.core().simulation;
			if(!year) {
				return sim;
			}
			return sim[year];
		},
		/*
				$j.o("timeline")
		*/
		timeline: function() {
			return privates.core().timeline;
		},
		/*
				$j.o("trends", "week", 2014)
		*/
		trends: function(increment, sinceWhen) {
			return privates.core().trends["by_"+increment].since[sinceWhen];
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
