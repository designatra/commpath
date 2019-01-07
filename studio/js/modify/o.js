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
		projects: function() {
			return this.projects;
		},
		/*
			Utility to get properties of a certain products > project

			$j.o("project", {
				product:"insurance portal",
				project:"Scheduled Payments"
			})
		*/
		project: function(o) {
			var project;
			$j.each($j.o("projects").by.product[o.product], function() {
				if(this.title==o.project) {
					project = this;
					return false;
				}
			});
			return project;
		},
		/*
			Utility to get properties of a certain products > projects > tools > version
			*** ORIGINAL OBJECT

			$j.o("version", {
				product:"insurance portal",
				project:"Scheduled Payments",
				tool:"web",
				version:0.1
			})
		*/
		version: function(o) {
			var version;
			$j.each($j.o("project", o).tools[o.tool].versions, function() {
				if(this.version==o.version) {
					version = this;
					return false;
				}
			});

			return version;
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
