$j.build("component").field = {
	/*
		COMPONENT: "field"

		$el.fragment("field")
	*/
	build: function(data) {
		return $j(this).build("field", data, {
				after: function(i, o) {	
					var o = $j.overload(o, {
						function:function() {
							return $j(this).field()
						},
						def: function() {
							return o;
						}
					}, $j(this));

					// TODO: Test this more thoroughly (afraid some situations will have field data but need to be updated)
					if($j.isEmptyObject($j(this).data("field"))) {
						$j(this)
							.data("field", o)
							.find("#message").build("field.message", o)
					}	
				},
				events:{
					after:[
						{
							name:"field"
						}
					]
				}
			}
		);
	},
	// methods: {
	// 	val: function(value) {
	// 		var $input = $j(this);
	// 		if(!$input.is("input")) {
	// 			$input = $j(this).find("input");
	// 		}
		
	// 		return $input
	// 			.val(value)
	// 			.trigger("validate");
	// 	}
	// },
	select: {
		build: function(data) {
			// TODO: if mock geneartion becomes popular..should move into something more abstract
			var generate = {
				years: function(range) {
					var d = new Date( "01 " + "Jan "+range[0]);
					first = d.getFullYear();

					var s = new Date( "01 " + "Jan "+range[1]);
					second = s.getFullYear();
					arr = Array();

					for(i = first; i <= second; i++) {
						arr.push({
							label:i
						});
					}

					return arr;
				}
			};


			return $j(this).build("field.select", data, {
				after: function(i, o) {
					var $el = $j(this);

					// TODO: if mock geneartion becomes popular..should move into something more abstract
					var options = overload(o.options, {
						array: function() {
							return o.options;
						},
						object: function() {
							if(o.options.generate) {
								var generatedData;
								$j.each(o.options.generate, function(dataType, criteria) {
									if(generate[dataType]) {
										generatedData = generate[dataType](criteria).reverse();
									}
								});
								return generatedData;
							}
							return o.options;
						}
					});


					/*
					$j(this)
						.find("select").build("field.option", options)
						.parent().selectmenu({
							appendTo: $el,
							width:false,
							position: {
								my : "left-25 top",
								at: "left bottom-2"
							},
							init: function() {
								console.log("INIT", $j(this))
							},
							open: function(e) {
								$j(this).closest("field").attr("expanded", "true");
							},
							close: function(e) {
								$j(this).closest("field").attr("expanded", "false");
							},
							change: function(event, ui) {
								return $j(this)
									.closest("field").attr("state", "selection")
									.attr("valid", true)
									//.trigger("changes")
									.trigger("valid");
							}
						});
					*/

					var pluginConfig = {
						theme:"b2c",
						minimumResultsForSearch: "Infinity",
						width:"style",
						placeholder: defined(o.label, "")
						//dropdownAutoWidth:true
					}

					if(o.config && o.config.preventClosing===true) {
						o.config.dropdownParent = $j(this)
					}

					// NOTE: Select2 plugin requires a blank spot at the beggining of the available options to support placeholder
					options.unshift({});
					var $select = $j(this)
						.find("select").css("width", "100%")
						.build("field.option", options)
						.parent().select2($j.extend({}, pluginConfig, defined(o.config, {})))

					$select
						.next(".select2-container").find(".select2-selection__arrow")
						.html('<svg class="oneui-core-arrow-down"><use xlink:href="#oneui-core-arrow-down"></use></svg>')

					$select.on({
						"select2:closing": function(e) {
							if(o.config && o.config.preventClosing===true) {
								e.preventDefault();
								return false;
							}

							TweenMax.to($j(this).next(".select2-container").find(".select2-selection__arrow svg"), .35, {
								//rotationZ:-90,
								//rotationY:-180,
								rotationX:0
							})
						},
						"select2:close": function(e) {

						},
						"select2:opening": function(e) {
							TweenMax.to($j(this).next(".select2-container").find(".select2-selection__arrow svg"), .35, {
								//rotationZ:-90,
								//rotationY:0,
								rotationX:180
							})
						},
						"select2:open": function(e) {
							if(o.config && o.config.autoOpen===true) {
								$j(this)
									.closest("field").children(".select2-container").removeAttr("style")
									.css({
										top:0,
										left:0
									})
									.children().css("position", "relative")

								e.preventDefault();
							}
						},
						"select2:selecting": function(e) {
							console.log($j(this))
						},
						/*
							e.params:{
								data:
								disabled: false
								element: option
								id: "Driver no longer has access to vehicles"
								selected: true
								text: "Driver no longer has access to vehicles"
								title: ""
							}
						 */
						"select2:select": function(e) {
							//console.log(e)
						},
						"select2:unselecting": function(e) {

						},
						"select2:unselect": function(e) {

						},
						"change.select2": function(e) {

						}
					})

					if(o.config && o.config.autoOpen===true) {
						$select
							.select2("open")
							.closest("field").attr("auto_open", "true")
						//.children().css("position", "relative")
					}
					$j.build("component").field.events.select.apply($el, o);
				}
			});
		}
	},
	events: {
		select: function() {
			$j(this).trigger("hide.next");

			$j(this)
				.on({
					changes: function(e) {
						$j.methods(e.how, {
							// keyup: function() {
							// 	$j(this).trigger("typing");
							// },
							focusin: function() {
								// if($j(this).is("[state=focused]")) {
								// 	return false;
								// }
								//
								// $j(this)
								// 	.stopTime("focusout")
								// 	.trigger("focused");
							},
							focusout: function() {
								$j(this)
									.stopTime("focusout")
									.oneTime(200, "focusout", function() {
										$j(this).trigger("validate");
									});
							}
						}, $j(this))


						///countCharacters($j(this));
						// TODO: explore interaction.velocity(e.how, e.timeStamp, $j(this));

						// e.who, e.what, e.how
						// function countCharacters($field) {
						// 	$field.attr("char-count", $field.field("input").length);
						// }
					},
					typing: function() {
						// $j(this)
						// 	.removeAttr("valid")
						// 	.attr({
						// 		state:"typing"
						// 	});
						//
						// monitorChanges($j(this));
					},
					idle: function() {
						// $j(this).attr({
						// 	state:"idle"
						// });
					},
					validate: function() {
						// IF field contains some characters (for now we're ignoring required field validation and more complex rules)
						//if(!$j(this).is("[char-count='0']")) {
							// THEN Validate

							// IF field is validated
							if($j(this).validate()) {
								return $j(this).trigger("valid");
							}
							return $j(this).trigger("invalid");
						//}
						// OTHERWISE skip validation
						return $j(this).trigger("idle")
					},
					//TODO: Valid is firing too many times
					valid: function() {
						$j(this)
							.attr({
								valid:"true"
							})
							//.field("format")
							//.trigger("idle")
							.parent().attr("valid_fields", $j(this).siblings("field").addBack().filter("[valid=true]").length);
					},
					invalid: function() {
						$j(this)
							.attr({
								valid:"false"
							})
							// OR MAYBE TRIGGER AN ISSUE
							//.trigger("idle")
							.parent().attr("valid_fields", $j(this).siblings("field").addBack().filter("[valid=true]").length);
					}
				});
		},
		// NOTE: There is so reused code for validating a select field (FOR NOW) due to issues with how the element is made
		//       and how it is validated, so if changes are made to to the following field events, they need to be made to selects events too
		field: function() {
			$j(this)
				.on({
					click: function(e) {
						e.stopImmediatePropagation();
					},
					keydown: function(e) {
						var key = e.key;

						if(e.which==32) {
							key = "Space";
						}

						$j.methods(key, {
							Space: function() {
								if($j(this).find("input").val().length<1) {
									e.preventDefault();
								}
							}
						}, $j(this));
					},
					changes: function(e) {
						$j.methods(e.how, {	
							keyup: function() {
								$j(this).trigger("typing");
							},
							focusin: function() {
								if($j(this).is("[state=focused]")) {
									return false;
								}

								$j(this)
									.stopTime("focusout")
									.trigger("focused");
							},
							focusout: function() {
								$j(this)
									.stopTime("focusout")
									.oneTime(200, "focusout", function() {
										$j(this).trigger("validate");
									});	
							}
						}, $j(this))
					

						countCharacters($j(this));
						// TODO: explore interaction.velocity(e.how, e.timeStamp, $j(this));

						// e.who, e.what, e.how
						function countCharacters($field) {
							$field.attr("char-count", $field.field("input").length); 
						}
					},
					focused: function() {
						$j(this).attr({
							state:"focused"
						});
					},
					typing: function() {
						$j(this)
							.removeAttr("valid")
							.attr({
								state:"typing"
							});

						monitorChanges($j(this));
					},
					idle: function() {
						$j(this).attr({
							state:"idle"
						});
					},
					validate: function() {
						// IF field contains some characters (for now we're ignoring required field validation and more complex rules)
						if(!$j(this).is("[char-count='0']")) {
							// THEN Validate
							
							// IF field is validated
							if($j(this).validate()) {
								return $j(this).trigger("valid");
							}
							return $j(this).trigger("invalid");
						}
						// OTHERWISE skip validation
						return $j(this).trigger("idle")
					},
					//TODO: Valid is firing too many times
					valid: function() {

						$j(this)
							.attr({
								valid:"true"
							})
							.field("format")
							.trigger("idle")
							.parent().attr("valid_fields", $j(this).siblings("field").addBack().filter("[valid=true]").length);
					},
					invalid: function() {
						$j(this)
							.attr({
								valid:"false"
							})
							// OR MAYBE TRIGGER AN ISSUE
							.trigger("idle")
							.parent().attr("valid_fields", $j(this).siblings("field").addBack().filter("[valid=true]").length);
					}
				});

				$j(this).on({
					keyup: function(e) {
						e.stopImmediatePropagation();

						$j.methods(e.key, {
							Tab: function() {
								$j(this).trigger("key.tab");
								return false;
							},
							Enter: function() {
								$j(this).trigger("key.enter");
							},
							def: function() {
								triggerChange(e);
							}
						}, $j(this));

						// if(e.key=="Tab") {
						// 	return false;
						// }
						// $j.log(e.key)
						
						// triggerChange(e);
					},
					focusin: function(e) {
						e.stopImmediatePropagation();
						triggerChange(e);
					},
					focusout:function(e) {
						e.stopImmediatePropagation();
						triggerChange(e);
					}
				}, "wrapper#input :input");

			/*
				triggerChange($j(this), e)

				TODO: Should really group all these in an object > vs this cutsie shit
			*/
			function triggerChange(e) {
				var $field = $j(e.delegateTarget);

				return $field.trigger({
					type:"changes",
					who:$field.attr("type"),
					what:$field.find("input").val(),
					how: e.type,
					e:e
				})
			};

			function monitorChanges($field) {
				return $field
					.stopTime("changes")
					.everyTime("750ms", "changes", function() {
						var $input = $j(this).find("input"),
							value = {
								current: $input.val(),
								previous: $input.data("value")
							};

						// IF current value matches previous value
						if(value.current===value.previous) {
							// THEN no changes have occured
							return $j(this)
								.stopTime("changes")
								.trigger("validate");
						}
						// OTHERWISE keep checking
						$input.data("value", $input.val());
					})
			};
		}
	}
};
