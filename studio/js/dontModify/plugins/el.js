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
			return overload(x, {
				string: function() {
					if(plugin.els[x]) {
						return plugin.els[x].apply(this, [y, z, a]);
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
	plugin.els = {
		papa: function() {
			return $j("#main-container");
		},
		/*
			$j.el("inspector")
			$j.el("inspector", "control")
			$j.el("inspector", "control", "primary")
			$j.el("inspector", "control", "secondary")
			$j.el("inspector", "control", "sandbox")
			$j.el("inspector", "item")
			$j.el("inspector", "tab")
			$j.el("inspector", "tab", "ideas")
		*/
		inspector:function(x, type, id) {
			$j.log("AHHHH", x, type, id)
			return $j.methods(x, {
				control: function() {
					var $control = $j(this).find("control#inspector");
					if(!id) {
						return $control;
					}

					var prefix = "#";
					if(id=="sandbox") {
						prefix = "";
					}
					$j.log(prefix+id, $control)
					return $control.children(prefix+id);
				},
				item: function() {
					return $j(this).children("item");
				},
				tab: function() {
					var $tab = $j(this).find("tab");
					if(!id) {
						return $tab;
					}
					// could also return active
					return $tab.filter("#"+id);
				},
				undefined: function() {
					return $j(this);
				}
			}, this.papa().find("wrapper#inspector"));
		}
		// designer: function() {
		// 	return this.papa().find("#clothing-designer");
		// },
		// /*
		// 	$j.el("views")
		// 	$j.el("views", 2)
		// */
		// views: function(x) {
		// 	var $views = this.designer().find(".fpd-views-selection .fpd-item");
		// 	if(x!==undefined) {
		// 		$views = $views.eq(x);
		// 	}
		// 	return $views;
		// },
		// views3d: function(x) {
		// 	// var $views = this.designer().find(".fpd-views-selection .fpd-item");
		// 	// if(x!==undefined) {
		// 	// 	$views = $views.eq(x);
		// 	// }
		// 	// return $views;
		// },
		// stage: function() {
		// 	return this.designer().find(".fpd-product-stage");
		// },
		// model2d: function(x) {
		// 	return this.stage().find(".canvas-container");
		// },
		// model3d: function(x) {
		// 	return this.stage().find("model[three=d]");
		// },
		// dialog: function(x) {
		// 	return $("#mCSB_3 .fpd-list");
		// },
		// controls: function() {
		// 	return this.joystick().find("controls");
		// },
		// control: function(index) {
		// 	var $controls = this.controls();
		// 	if(index===undefined) {
		// 		return $controls.find("control");
		// 	}
		// 	return $controls.find("control").eq(index);
		// },
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
