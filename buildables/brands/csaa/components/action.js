$j.build("component").action = {
	/*
		COMPONENT: "action"

		$el.build("action")
	*/
	build: function(data, config) {
		return $j(this).build("action", data, {
			// TODO: Since adding the extension concept to components, the structure of a component and how it should extend a passed configuration needs  work
			// TODO: Initially was just prototyping code structure but now that I'm on a second component, there is a lot redundancy
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				var $el = $j(this);

				if(config.after) {
					config.after.apply($el, arguments);
				}
				
				// TODO: the way I structured findKey was very specific for easily calling a component's plugin/extension. 
				////////    It works well except when the key being sought is at the top most level of the object (need to fix)
				var extensions = $j.findKey({
					instance:o
				}, "plugin");

				overload(extensions, {
					array: function() {
						$j.each(extensions, function() {
							applyExtension(this);
						});
					},
					object: function() {
						applyExtension(this);
					}
				}, extensions);

				$j.build("component")["action"].events.default.apply($el, [o]);

				function applyExtension(data) {
					var extension = {
						name:Object.keys(data)[0]
					};
					extension.config = data[extension.name];
					
					var extensions  = $j.build("component")["action"].extensions;
					if(!extensions) {
						return false;
					}

					if(!extensions[extension.name]) {
						return false;
					}

					extensions[extension.name]($el, extension);
				};
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});
	},
	extensions: {
		drop_down: function($el, extension) {
			// TODO: Fix this crap...getting so tired and writing shit, action.block.js event for drop_down should be extending 
			////////     so shouldn't have to do this again...well actually maybe that's why...since we have to have the whole structure
			$j.build("component")["action.block"].events.drop_down.apply($el.closest("[dropdown_state]"), [{
				plugin: {
					drop_down: extension.config
				}
			}]);
		}
	},
	events: {
		default: function() {
			$j(this).on({
				click: function(e) {
					$j.throttle("clickAction", e, 300, function() {
						var instance = $j(this).build("data").instance.data;
			
						if(instance.on&&instance.on.click) {
							instance.on.click.apply($j(this), [e, instance]);
						}
					});
				}
			});
		}
	},
	/*
		$el.build("action.button")
	*/
	button: {
		build: function(data, config) {
			$j(this).build("action.button", defined(data, 1), {
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

					$j.build("component").action.events.default.apply($j(this), [o]);
					$j.build("component").action.button.events.default.apply($j(this), [o]);
				},
				completed: function(o) {
					if(config.completed) {
						config.completed.apply($j(this), arguments);
					}
				}
			});
			
			// return $j(this)
			// 	.build({
			// 		name:"panel.prompt",
			// 		data:data,
			// 		after: function(i, o) {
			// 			$j(this)
			// 				.find("wrapper#buttons")
			// 				.build("action.button", o.buttons);

			// 			// TODO: Hack to deal with nested component event issue
			// 			$j.build("component").action.button.events.actions.apply($j(this), [o]);
			// 		}
			// 	});
		},
		events: {
			default: function(o) {
				$j(this)
					.on({
						// TODO: Break this into more events so it can be programatically invoked "more specifically"
						click: function(e) {
							if($j(this).is("[active=true]")) {
								return false;
							}
							
							var instance = $j(this)
								.attr("active", "true")
								.siblings("[active=true]").removeAttr("active")
								.end().build("data").instance.data;
								
							// IF button has some contextual description to display on click
							if(instance.description||instance.description===false) {
								var $description = $j(this).closest("control, form, fields").children("thing#description");
								
								// THEN populate this controls description element
								var description = instance.description;
								if(description.length<0 || description===false) {
									 $description.empty();
								} else {
									$description.html(description);
								}
							}

							// TODO: Pretty bad approach (rethink how we connect buttons and views)
							if(instance.on&&instance.on.select) {
								var $views = $j(this).closest("fields").children("views"),
									$view = $views.filter("[for="+$j(this).parent().attr("id")+"]");

								if($view.length<1) {
									$view = $views.filter("[for="+$j(this).closest("control").attr("id")+"]");
								}
								
								// NOTE: Semi hack to prevent emptied views from causing flicker/page jump 
								//////	   Not ready to audit elements properly (only removing those that change)
								var view_height = $view.height();
								if(view_height>0) {
									$view.height(view_height);		
								}

								$view
									.empty()
									.removeAttr("task")
									.removeAttr("valid_fields")
									.attr("button", $j(this).attr("id"));
		
								var elements = instance.on.select.build;
								overload(elements, {
									array: function() {
										$j.each(elements, function() {
											buildView($view, this)
										});
									},
									string: function() {
										buildView($view, elements)
									}
								});

								$view.height("auto")

								function buildView($parent, element) {
									return $parent.build(element);
								}
							}

							var button = buttons[$j(this).attr("id")];
							if(button) {
								button.apply($j(this), [instance, $view]);
							}
						}
					});
			},
			buttons: function() {
				$j(this)
					.on({
						click: function() {
							$j.methods($j(this).attr("action"), {
								confirm: function() {
									$j(this).trigger("hide.panel")
								},
								cancel: function() {
									$j(this).trigger("hide.panel");
								}
							}, $j(this));
						}
					}, "action[action]")
			}
		}
	}
};
