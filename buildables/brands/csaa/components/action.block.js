$j.build("component")["action.block"] = {
	inventory: {
		focus: {
			summary:"Typically triggers a new workflow, within the container card",
			content:[
				{
					type:"text",
					prop: "single line",
					example:"don't see your policy?"
				}
			],
			dependencies:["action", "thing", "wrapper"]
		},
		"expand.items": {
			summary:"Reveals a list of items like downloadable files when clicked",
			content:[
				{
					type:"text",
					prop: "two lines",
					example:["auto policy", "AZSS800923421"]
				},
				{
					type:"icon",
					prop: "right",
					example:["oneui_right_arrow"]
				}
			],
			plugins: [
				{
					name:"drop_down"
				}
			],
			dependencies:["action", "thing", "wrapper", "item"]
		}
	},
	/*
		COMPONENT: "action.block"

		$el.build("action.block")
	*/
	build: function(data, config) {
		$j(this).build("action.block", defined(data, 1), {
			//insert:defined(config.insert, ""),
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				var $el = $action_block = $j(this);

				// NOTE: Difficult to hide a leading icon if not defined > empty first column so :empty css hides it
				var $col_1 = $j(this).find(">wrapper>wrapper:first");
				if($col_1.children("svg").is(".undefined")) {
					$col_1.empty();
				}

				var layout = o.layout;
				if(layout) {
					var cols = layout.columns;
					if(cols) {
						$j.each(cols, function(colID, col) {
							$j.methods(colID, {
								1: function() {

								},
								2: function() {

								},
								3: function() {
									var col3_data = overload(col.action, {
										/*
											layout: {
												columns: {
													3: {
														action:"edit
													}
												}
											}
										 */
										string: function() {
											return {
												label:col.action
											};
										},
										/*
											layout: {
												columns: {
													3: {
														action:{
															type:"add_vehicle",
															icon:"oneui-android-add-circle"
														}
													}
												}
											}
										 */
										object: function() {
											return col3_data = {
												icon:col.action.icon,
												action:col.action.type
											};
										}
									});

									$j(this)
										.last()
										.build("action", col3_data, {
											insert:"before"
										});
								}
							}, $el.find(">wrapper>wrapper"));
						});
					}
				}

				if(config.after) {
					if(!o.actions) {
						// NOTE: Added to help with some special cases like with the mypolicy-smarttrek card component(dont get what it does now though)
						if(o.isAction && o.isAction!==true) {
							return false;
						}
					} 
					config.after.apply($el, arguments);
				}
				
				// Designs suggest that card headers may contain a pill as a common pattern
				var pill = $j.findKey(o, "pill");
				if(pill) {
					var $pillParent = $j(this);
					//console.log("PARENT", $pillParent, pill)
					// TODO: This is disgusting
					if((pill.pill && pill.pill.selector)||pill.selector) {
						$pillParent = $pillParent.find(defined(pill.selector,pill.pill.selector));
					} else {
						//TODO: Setting the default state is not currently THAT deliberate and it should BE!
						$pillParent =$pillParent.find(">wrapper>wrapper").eq(1);
					}

					$pillParent.build("pill", defined(pill.pill, pill));
				}

				// TODO: Step 2 in migrating to an extension/plugin system for build
				var extensions = o.plugin;
				if(!extensions) {
					extensions = $j.findKey(o, "plugin");
				}
				
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

				/*
					Methods dealing with the different TYPES of action blocks
						like > informative, drop down, highligh/focus

					Functionality contained in these  methods is DIFFERENT than functionalilty added by an extension (or plugin
						...but how is it different? Still defining that...stay tuned

					@defined(o.action, o.for) uses element attributes to determine it's REAL type. 
						....elements have types, but then those elements with types have something like a subtype
						    Sometimes that TYPE is determined by context or even it's intention
						    TODO: Determine more consistent way to type elements > [action=], [for=]
				*/ 
				$j.methods(defined(o.action, o.for), {
					inform: function() {
						return $j(this)
							.children("wrapper")
							.children("wrapper:last").hide();
					},
					/*
						Attributes being ignored (and caught by def):
							[ for = vehicle, policy
							[ action = focus, details, drop_down

							policy.action > drop_down
					*/
					def: function() {
						//$j.log("no special typing", o)
					}
				}, $action_block);

				$j.build("component")["action.block"].events.default.apply($el, [o]);

				function applyExtension(data) {
					var extension = {
						name:Object.keys(data)[0]
					};
					extension.config = data[extension.name];

					var extensions  = $j.build("component")["action.block"].extensions;
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
		switch: function($el, extension) {
			$el.find(">wrapper>wrapper:last").build("control.switch")
		},
		progress_circle: function($el, extension) {
			// TODO: Might not always have a selector so we should handle both cases
			// TODO: Should think about a global plugin mapping object so plugins can be swapped out (that lives outside of components)

			var config = extension.config;
			// TODO: should probably have a default state
			if(!config) {
				return $el;
			}

			var $parent = $el;
			if(config.selector) {
				$parent= $parent.find(config.selector);
			} else {
				$parent =$parent.find(">wrapper>wrapper:first");
			}
						
			$parent.circleProgress($j.extend({
					value:0,
					startAngle:(270/180)*Math.PI,
					size: 66,
					thickness:3,
					fill: "#0096d6",
					emptyFill:"#EBEBEB"
				},
				config.properties
			));
		},
		drop_down: function($el, extension) {
			var elementBuildName = extension.config.element;

			// if the element's name is not specific
			if(!elementBuildName) {
				// THEN building a regular drop down with ITEMS vs single expandable/ collapsable item
				var items = extension.config.data.items;
				if(items) {
					return $el
						.build("wrapper", {
							id:"items"
						}, function() {
							// All drop downs with a list of items should be hidden immediatly, if config specifies for iitems 
							// to be initially visible, the event init will correct the specified visibility
							$j(this).hide();
						})
						.build("item", items, {
							after: function(i, o) {
								var $item = $j(this).children("wrapper");
								$item.build("thing", {
									content:o.line1
								});
								$item.build("thing", {
									content:o.line2
								});
								$j(this).build("icon", {
									icon:o.icon
								});
							},
							completed: function(o) {
								var $action_block = o.$parent.closest("action[type=block]");

								$j.build("component")["action.block"].events.drop_down.apply($action_block, [o]);
							}
						});
				}
			}

			// Unlike default drop downs with a list of items (aka options), action block drop downs can control the visibility of a single items wrapper	
			return $el
				.build(extension.config.element, extension.config.data, {
					after: function(i, o) {
						var config = extension.config;
						if(config && config.after) {
							config.after.apply($j(this), [i, o]);
						}
					},
					completed: function(o) {
						$j.build("component")["action.block"].events.drop_down.apply(o.$parent.closest("action[type=block]"), [o]);
					}
				});
		}
	},
	events: {
		// TODO: Meant to hold events dealing specifically with action blocks...should follow object paradigm though
		default: function(o) {
			var $el= $j(this);
			/*
				on:{
					click: function(e) {
						panel.build("full_page");
					}
				}

				NOTE: Only detects events at the build objects top level
				NOTE: Needs more validation
			*/
			if(o.on) {
				$j.each(o.on, function(evtType, evt) {
					$el.on(evtType, evt);
				});
			}
		},
		/*
			$j.build("component")["action.block"].events.drop_down.apply($j(this), [o]);
		*/
		drop_down: function(o) {
			var $drop_down_container = $j(this).children("wrapper").last();

			// $drop_down_container.css({
			// 	marginTop:$drop_down_container.outerHeight()*-1
			// });

			$j(this)
				.on({
					"toggle.dropdown": function(e) {
						var event = defaultEventObj(e);

						event.type = "expand.dropdown"
						// IF drop down items are visible
						if($j(this).find(event.instance.plugin.drop_down.items.selector).is(":visible")) {
							// THEN they need to be hidden (collapsed)
							event.type = "collapse.dropdown";
						}

						return $j(this).trigger(event);
					},
					"expand.dropdown": function(e) {
						// NOTE: Reevaluate if have time
						var instance= $j(this).build("data").instance.data;
						// NOTE: YUKKKKKKK
						if(instance.plugin) {
							var methods = instance.plugin.drop_down;
							
							if(methods && methods.on) {
								methods = methods.on;
								if(methods && methods.expand) {
									methods.expand.apply($j(this), [instance, e])
								}
							}
						}

						var $drop_down_container = $j(this)
							.attr("dropdown_state", "expanded")
							.find(defaultEventObj(e).instance.plugin.drop_down.items.selector)

						var animation = $j.what("animation");
						if(!animation) {
							var animation = {
								duration:350,
								easing:[125,20]
							}
						}

						$drop_down_container.css("marginTop", $drop_down_container.height()*-1)
						$drop_down_container.velocity(
							{
								marginTop:0
							},
							{
								duration:defined(animation.duration, 350),
								easing:defined(animation.easing, [125,20]),
								begin: function() {
                                    $j(this).prev("wrapper").find("wrapper:nth-child(3) svg").velocity({
                                        rotateZ:"180deg"
                                    })
								},
								display:"block"
							});


						/*
						var set_zIndex;
						$drop_down_container
							.velocity({
								translateZ:"4px",
								translateY:"-2px",
								//opacity:1,
								tween: 100,
								height:"300px",
								borderWidth:"2px"
							}, {
								easing:[400, 30],
								display:"block",
								duration:1000,
								begin: function() {
									set_zIndex = false;
								},
								progress: function(elements, complete, remaining, start, tweenValue) {
									console.log(tweenValue, remaining)
									if(set_zIndex!==true) {
										if(tweenValue>90) {
											$j(elements).css("zIndex", 5);
											set_zIndex = true;
										}
									}
								}
							})
						*/
					},
					"collapse.dropdown": function(e) {
                        var $drop_down_container = $j(this)
							//.attr("dropdown_state", "collapsed")
							.find(defaultEventObj(e).instance.plugin.drop_down.items.selector)

						var animation = $j.what("animation");
						if(!animation) {
							var animation = {
								duration:350,
								easing:[125,20]
							}
						}

                        $drop_down_container.velocity(
                                {
                                    marginTop:-1*$drop_down_container.outerHeight()
                                },
                                {
                                    display:"none",
	                                duration:defined(animation.duration, 350),
	                                easing:defined(animation.easing, [125,20]),
									begin: function() {
                                    	$j(this).prev("wrapper").find("wrapper:nth-child(3) svg").velocity({
                                            rotateZ:"0deg"
                                        })
									},
									complete: function() {
                                    	$j(this).closest("action").attr("dropdown_state", "collapsed");
									}
                                });
						/*
					   var set_zIndex;
					   $drop_down_container
						   .velocity({
							   translateZ:"-350px",
							   translateY:"-20px",
							   //opacity:0,
							   height:0,
							   borderWidth:"0px",
							   tween: 100
						   }, {
							   easing:[400, 30],
							   display:"none",
							   duration:1000,
							   begin: function() {
								   set_zIndex = false;

								   $j(this).prev("wrapper").find("wrapper:nth-child(3) svg").velocity({
									   rotateZ:"0deg"
								   })
							   },
							   complete: function() {
								   $j(this).closest("action").attr("dropdown_state", "collapsed");
							   },
							   progress: function(elements, complete, remaining, start, tweenValue) {
								   if(set_zIndex!==true) {
									   if(tweenValue>70) {
										   $j(elements).css("zIndex", 0);
										   set_zIndex = true;
									   }
								   }
							   }
						   })
					   */
					}
				})
				.on({
					click: function(e) {
						$j.throttle("clickActionBlockDropdown", e, 300, function() {
							// IF there is only one wrapper
							if($j(e.delegateTarget).children("wrapper").length<2) {
								// THEN dont fire this click event
								return false;
							}

							$j(this).trigger({
								type:"toggle.dropdown",
								instance: defined(e.instance, {})
							});
						});
					}
				}, ">wrapper:first");

			// TODO: The way that the eventObj is being extended and wrapped is redundant and starting to cause issues for action.js
			// Ensure that every action block with drop down functionality has an initial state > default: "collapsed"
			$j(this).attr("dropdown_state",  defaultEventObj({instance:o}).instance.plugin.drop_down.items.init_state);
			
			function defaultEventObj(e) {
				var event = {};

				event.instance = $j.extend({}, 
					{
						plugin:{
							drop_down: {
								items: {
									init_state:"collapsed",
									selector: "wrapper#items,wrapper[type=drop_down]"
								}
							}
						}
					},
					e.instance
				);

				return event;
			}
		}
	}
};
