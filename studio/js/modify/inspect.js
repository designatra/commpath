(function($j) {
	var plugin = {
		name: "inspect",
		methods: {},
		init: false,
		data: {}
	};
	
	/*
		$j(item).inspect()

		NOTE: Not pretty but good enough for now. Manually creating from data clumps
	*/
	var dom = plugin.methods.dom = {
		init: function(x) {
			return overload(x, {
				string: function() {
					
				},
				object: function() {
					return dom.core.apply($j(this), arguments);
				},
				undefined: function() {
					return dom.core.apply($j(this));
				}
			}, $j(this));
		},
		/*
			$j("item").inspect();
		*/
		core: function(x) {
			
		}
	};
	

	var util = plugin.methods.util = {
		init: function(x, y, z) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x](y, z);
					}
					/*
						$j.inspect("action.block", buildableObject)
					*/
					return plugin.privates.core(x, y, z);
				},
				/*
					$j.inspect(buildable)
				*/
				object: function(buildable) {
					return $j();
				},
				undefined: function() {
					return plugin.privates.core();
				}
			});
		},
		/*
			$j.inspect("show")
		*/
		show: function() {
			privates.inspectors.show();
		},
		/*
			$j.inspect("code", buildable)

			RETURNS > original buildable object

			NOTE: Shouldn't have the element/parent hardcoded, but whatever
		*/
		code: function(buildable) {
			$j.el("tab", "inspector_json")
				.parent().next("#tab-body").children("[tab=inspector_json]").find("pre").empty()
				.build("code", {
					class:"language-json",
					code:JSON.stringify(buildable, null, 2)
				}, function() {
					privates.inspectors.show();
				});

			return buildable;
		},
		/*
			$j.inspect("properties", buildable)

			RETURNS > original buildable object
		*/
		properties: function(buildable) {
			$j.methods(buildable.name, {
				// "pill": function() {
				// 	return $j.inspect("action.block-expand_view", buildable)
				// },
				"action.block": function() {
					var response = $j.methods(buildable.instance.action, {
						drop_down: function() {
							return $j.inspect("action.block-expand_view", buildable)

							//return inspectors["action.block-expand_view"](buildable);
						},
						inform: function() {
							return $j.inspect("action.block-inform", buildable);
						},
						focus: function() {
							return $j.inspect("action.block-focus", buildable);
						},
						def: function() {
							return true;
						}
					});

					if(response!==true) {
						return false;
					}

					if(buildable.instance.icon) {
						if(buildable.instance.icon.plugin && buildable.instance.icon.plugin.progress_circle) {
							return $j.inspect("action.block-details_pill", buildable);
						}
					}

					var vehicle = buildable.instance.vehicle;
					if(vehicle && vehicle.icon && vehicle.line1 && vehicle.line2) {
						return $j.inspect("action.block-details", buildable);
					}

					var policy = buildable.instance.policy;
					if(policy && policy.premium && policy.date_due) {
						return $j.inspect("action.block-launch", buildable);
					} 
					if(policy && policy.action=="drop_down") {
						return $j.inspect("action.block-expand_items", buildable);
					}

					return $j.inspect("generic", buildable);
				},
				def: function() {
					return $j.inspect(buildable.name, buildable);
				}
			});

			return buildable;
		}
	};

	/*
		Ideally these could created when fragment creates elements
	*/
	var privates = plugin.privates = {
		core: function(name, buildable) {
			var inspector = privates.inspectors[name];
			if(!inspector) {
				return privates.inspectors.generic(buildable);
			}
			return inspector.apply(privates.inspectors, [buildable]);
		},
		/*
			private.data($inspect);
		*/
		data: function($el) {
			// var data = $el.data("inspect");
			// if(!data) {
			// 	data = $el.data("inspect", {});
			// }
			// return data;
		},
		inspectors: {
			/*
				privates.inspectors.show();
			*/
			show: function() {
				var $inspector = $j.el("panel", "inspector");
				if($inspector.is(".velocity-animating") || $inspector.is(":hidden")) {
					return $inspector.velocity("slideDown", {
						complete: function() {
							adjustPanels()
						}
					});
				}
				return $inspector;
			},
			/*
				privates.inspectors.$el();
			*/
			$el: function() {
				return $j.el("panel", "inspector").find("control[type=inspector]").empty();
			},
			generic: function(o) {
				var a = [{
					value:o.name,
					label:"name"
				}];

				var instance = o.instance;
				if(!instance) {
					a.push({
						value:o.properties.id,
						label:"ID"
					});
				} else {
					$j.each(["id", "theme", "type", "title"], function(i, key) {
						if(instance[key]) {
							a.push({
								value: instance[key],
								label:key
							});
						}
					});
				}

				console.log("INSPECT", o)

				var usage = o.usage;
				if(usage.dependencies) {
					a.push({
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					})
				};
				if(usage.count) {
					a.push({
						value:o.usage.count,
						label:"Usage Count"
					});
				}

				return this.$el().build("item", a);
			},
			pill: function(o) {
				var instance = o.instance;
				if(instance.pill) {
					instance = instance.pill;
				}
				return this.$el().build("item", [
					{
						value:o.name,
						label:"element"
					},
					{
						value:instance.label,
						label:"label"
					},
					{
						value:instance.state,
						label:"theme"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:defined(o.usage.dependencies, ["none"]).join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
// {
//   "name": "action.button",
//   "instance": {
//     "label": "owned",
//     "class": "secondary",
//     "on": {
//       "select": {
//         "build": "field.address-financial_interest"
//       }
//     }
//   },
//   "properties": {
//     "type": "button",
//     "tag": "ACTION"
//   },
//   "usage": {
//     "count": 12,
//     "instances": {
//       "undefined": {
//         "label": "no",
//         "class": "secondary"
//       }
//     }
//   }
// }
			"action.button": function(o) {
				var instance = o.instance;

				var event = {
					name:"N / A",
					build: "build > N / A"
				}
				if(instance.on) {
					var eventName = Object.keys(instance.on);
					event.name = eventName;
					event.build = instance.on[eventName].build;
				}
				return this.$el().build("item", [
					{
						value:o.name,
						label:"element"
					},
					{
						value:instance.label,
						label:"label"
					},
					{
						value:instance.class,
						label:"theme / style"
					},
					{
						value:event.name,
						label:"event name"
					},
					{
						value:event.build,
						label:"build element"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:defined(o.usage.dependencies, ["none"]).join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-focus": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Focus",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-details": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Details",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-inform": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Inform",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-launch": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Launch",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:"Pill, Theme",
						label:"supports"
					},
					{
						value:o.instance.policy.pill.label + " ( "+o.instance.policy.pill.state+" ) ",
						label:"pill"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-details_pill": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Details + Status",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:"Progress circle, Pill, Theme",
						label:"supports"
					},
					{
						value:o.instance.pill.label + " ( "+o.instance.pill.state+" ) ",
						label:"pill"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			},
			"action.block-expand_items": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Expand (items)",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:"Expand / Collapse, Theme",
						label:"supports"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				])
			},
			"action.block-expand_view": function(o) {
				return this.$el().build("item", [
					{
						value:o.name + " ( brand )",
						label:"element"
					},
					{
						value:"Expand (view)",
						label:"intention"
					},
					{
						value:"N / A",
						label:"DPL Pattern"
					},
					{
						value:"Expand / Collapse, Theme",
						label:"supports"
					},
					{
						value:o.usage.dependencies.join(", "),
						label:"dependencies"
					},
					{
						value:o.usage.count,
						label:"Usage Count"
					}
				]);
			}
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
