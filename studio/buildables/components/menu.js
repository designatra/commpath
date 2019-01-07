$j.build("component")["code"] = {
	/*
		COMPONENT: "menu"

		$el.build("menu")
	*/
	build: function(data, config) {
		var menu = $j(this).build("menu", defined(data, 1), {
			events: function() {
				if(config.events) {
					return config.events;
				}
			},
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				if(config.after) {
					config.after.apply($j(this), arguments);
				}

			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});

		return menu;
	},
	/*
		$j.build("component")["menu.context"].events.default.apply($j(this), [o]);
	*/
	events: {
		// TODO: Meant to hold events dealing specifically with code blocks...should follow object paradigm though
		default: function() {
			// $j(this).on({
			// 	click: function(e) {
			// 		$j.throttle("clickcode", e, 300, function() {
			// 			var instance = $j(this).build("data").instance.data;

			// 			$j.log(instance)
			
			// 			if(instance.on&&instance.on.click) {
			// 				instance.on.click.apply($j(this), [e, instance]);
			// 			}
			// 		});
			// 	}
			// });
		}

	},
	/*
		$el.build("menu.context", {

		})
	*/
	context: {
		build: function(data, config) {
			var plugins = $j.what("plugins");
			var contextMenu = overload(plugins.contextMenu, {
				object: function() {
					return plugins.contextMenu;
				},
				undefined: function() {
					var $inspect = $j.el("papa").build("item", {
						id:"inspect",
						type:"context_menu"
					}, function() {
						plugins.contextMenu = {
							$:{
								inspect: $j(this)
							},
							update: function() {
								build_context_menu()
							}
						}
					});

					function build_context_menu(items) {
						$j.contextMenu({
							selector: "item#inspect[type=context_menu]",//'.context-menu-one',
							trigger: "none",
							callback: function(key, options) {
								var m = "clicked: " + key;
								window.console && console.log(m) || alert(m);
							},
							items: {
								"edit": {name: "Edit", icon: "edit"},
								"cut": {name: "Cut", icon: "cut"},
								"copy": {name: "Copy", icon: "copy"},
								"paste": {name: "Paste", icon: "paste"},
								"delete": {name: "Delete", icon: "delete"},
								"sep1": "---------",
								"quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
							}
						});
					}

					// $j(this).build("menu.context", defined(data, 1), {
					// 	after: function(i, o) {
					//
					// 	}
					//
					// });
				}
			}, $j(this));

			$j(this).build("menu.context", defined(data, 1), {
				events: function() {
					if(config.events) {
						return config.events;
					}
				},
				populate: function(i, o) {
					if(config.populate) {
						return config.populate.apply($j(this), arguments);
					}
				},
				after: function(i, o) {
					if(config.after) {
						config.after.apply($j(this), arguments);
					}




					//$j.build("component").menu.events.default.apply($j(this), [o]);
					//$j.build("component").menu.context.events.default.apply($j(this), [o]);
				},
				completed: function(o) {
					if(config.completed) {
						config.completed.apply($j(this), arguments);
					}
				}
			});
		},
		events: {
			/*
				$j.build("component").menu.context.events.default.apply($j(this), [o]);
			*/
			default: function(o) {
				$j(this)
					.on({
						click: function(e) {
							// var instance = $j(this)
							// 	.end().build("data").instance.data;

						}
					});
			},
			/*
				$j.build("component").menu.context.events.buttons.apply($j(this), [o]);
			*/
			buttons: function() {
				// $j(this)
				// 	.on({
				// 		click: function() {
				//
				// 		}
				// 	}, "action[action]")
			}
		}
	}
};
