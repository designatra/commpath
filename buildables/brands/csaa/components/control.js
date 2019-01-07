$j.build("component").control = {
	/*
		COMPONENT: "control"
			RETURNS > Parent Context (chainable)

		$el.build("control")
	*/
	build: function(data, config) {
		$j(this).build("control", defined(data, 1), {
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
					return config.after.apply($j(this), arguments);
				}
				//$j.build("component").control.events.default.apply($j(this), [o]);
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});

		return $j(this);
	},
	events: {
		default: function() {
			
		}
	},
	/*
		$j(parent).build("control.prompt-inline")
			RETURNS > Parent Context

		$fields.build("control.prompt-inline", {
			id:"gender",
			buttons:[
				{
					label:"male",
					class:"secondary"
				},
				{
					label:"female",
					class:"secondary"
				}
			]
		});

		$fields.build("control.prompt-inline", {
			label:"Automobile Death Benefit",
			description:"Automobile Death Benefits pay a benefit is death is caused by a car accident",
			buttons:[
					{
						label:"yes",
						class:"secondary"
					},
					{
						label:"no",
						class:"secondary"
					}
				]
			});

		$parent.build("control.prompt-inline", {
			id:"vehicle_location",
			label:"Is your vehicle located at your residence?",
			// NOTE: assigning a value to views instructs the control.x builder to also build a views wrapper
			views:"vehicle_location",
			buttons:[
				{
					label:"yes",
					class:"secondary",
					on:{
						select:{
							build:"wrapper"
						}
					}
				},
				{
					label:"no",
					class:"secondary",
					description:"Where do you park your car on a regular basis?",
					on:{
						select:{
							build:"field.address-simple"
						}
					}
				}
			]
		});

		$parent.build("control.prompt-inline", {
			id:"vehicle_criteria",
			label:"To help you get started tell us about this vehicle…",
			views:"vehicle_criteria",
			buttons:[
				{
					id: "vehicle_purchased",
					label:"vehicle i've purchased",
					class:"secondary",
					description:false,
					on:{
						select:{
							build:["field.date-purchase", "field.vin"]
						}
					}
				},
				{
					id: "vehicle_shopping",
					label:"just looking",
					class:"secondary",
					description:"Once you purchase a vehicle to add to your policy, we’ll ask for the purchase date. Meanwhile, happy shopping!",
					on:{
						select:{
							build:"field.select.vehicle-criteria"
						}
					}
				}
			]
		});
	*/
	"prompt-inline": {
		build: function(data, config) {
			$j(this).build("control.prompt-inline", defined(data, 1), {
				populate: function(i, o) {
					if(o.buttons) {
						o.layout = defined(o.layout, "col-"+o.buttons.length);
					}

					if(config.populate) {
						return config.populate.apply($j(this), arguments);
					}
				},
				after: function(i, o) {	
					if(config.after) {
						config.after.apply($j(this), arguments);
					}

					if(o.buttons) {
						$j(this)
							.find("wrapper#buttons")
							.build("action.button", o.buttons);
					}

					if(o.views) {
						$j(this).parent().build("views", {
			 				for:o.views
			 			});
					}
					
					//$j.build("component").control["prompt-inline"].events.default.apply($j(this).closest("control"), [o]);
				},
				completed: function(o) {
					if(config.completed) {
						config.completed.apply($j(this), arguments);
					}
				}
			});

			return $j(this);
		},
		events: {
			default: function(o) {
				
			}
		}
	},
	/*
		$el.build("control.radio-options")
			RETURNS > Parent Context

		$parent.build("control.radio-options", {
			id:"delivery_channel",
			label:"This is a sample lable to demonstrate",
			buttons:[
				{
					class:"secondary",
					label:"us mail",
					description:"A description about US MAIL"
				},
				{
					class:"secondary",
					label:"email",
					description:"And then there is sometihng to say about EMAIL"
				},
				{
					class:"secondary",
					label:"alexa",
					description:"Make sure we handle when only some have descriptions",
					active:true
				}
			]
		});

		$parent.build("control.radio-options", {
			id:"vehicle_ownership",
			label:"My vehicle is...",
			buttons:[
				{
					id:"vehicle_owned",
					label:"owned",
					class:"secondary",
					on:{
						select:{
							build:"field.address-financial_interest"
						}
					}
				},
				{
					id:"vehicle_financed",
					label:"financed",
					class:"secondary",
					on:{
						select:{
							build:"field.address-financier"
						}
					}
				}
			]
		});

		TODO: Need to abstract how views work (and are built, then we can remove from PBE)		
	*/
	"radio-options": {
        build: function(data, config) {
            $j(this).build("control.radio-options", defined(data, 1), {
                events: function() {
                    if(config.events) {
                        return config.events;
                    }
                },
                populate: function(i, o) {
                    if(o.buttons) {
                        o.layout = defined(o.layout, "col-"+o.buttons.length);
                    }

                    if(config.populate) {
                        return config.populate.apply($j(this), arguments);
                    }
                },
                after: function(i, o) {
                    // NOTE: Since this control will always have buttons and each button is actually an action.button, the buttons body element is being returned instead
                    var $buttons= $j(this).find("wrapper#buttons");

                    if(config.after) {
                        config.after.apply($buttons, arguments);
                    }

                    if(o.buttons) {
                        $buttons.build("action.button", o.buttons, {
                            completed: function(o) {

                            }
                        });
                    }

                    if(o.views) {
                        $j(this).parent().build("views", {
                            for:o.views
                        });
                    }

                    //$j.build("component").control["radio-options"].events.default.apply($j(this), [o]);
                },
                completed: function(o) {
                    if(config.completed) {
                        config.completed.apply($j(this), arguments);
                    }
                }
            });

            return $j(this);
        },
        events: {
            default: function(o) {

            }
        }
    },
	/*
		$j(parent).build("control.toggle")
	*/
	toggle: {
		build: function(data, config) {
			$j(this).build("control.toggle", defined(data, 1), {
				after: function(i, o) {	
					if(config.after) {
						config.after.apply($j(this), arguments);
					}
					
					$j.build("component").control.toggle.events.default.apply($j(this).closest("control"), [o]);
				},
				completed: function(o) {
					if(config.completed) {
						config.completed.apply($j(this), arguments);
					}
				}
			});
		},
		events: {
			default: function(o) {
				$j(this).on({
					click: function(e) {
						var $target = $j(e.target);
						// If the indicator is clicked
						if($target.is("#indicator")) {
							// THEN toggle the state
							return $j(this).trigger("toggle");
						}
						// OTHERWISE the wrapper was clicked
						// AND...we should also toggle?
						$j(this).trigger("toggle");
					},
					toggle: function(e) {
						if($j(this).is("[indicator=off]")) {
							return $j(this).trigger("on");
						}
						return $j(this).trigger("off");
					},
					on: function(e) {
						$j(this).attr("indicator", "on");
					},
					off: function(e) {
						$j(this).attr("indicator", "off");
					}
				});
			}
		}
	},
    switch: {
        build: function(data, config) {
            $j(this).build("control.switch", defined(data, 1), {
                events: function() {
                    if(config.events) {
                        return config.events;
                    }
                },
                // populate: function(i, o) {
                //     if(o.buttons) {
                //         o.layout = defined(o.layout, "col-"+o.buttons.length);
                //     }
                //
                //     if(config.populate) {
                //         return config.populate.apply($j(this), arguments);
                //     }
                // },
                after: function(i, o) {
                    // NOTE: Since this control will always have buttons and each button is actually an action.button, the buttons body element is being returned instead
                    var $input = $j(this).find("input:checkbox");

                    var $checkbox = new Switchery($input[0], {
                        color: '#1778D3',
                        // secondaryColor: '#dfdfdf',
                        // jackColor: '#fff',
                        // jackSecondaryColor: null,
                        // className: 'switchery',
                        // disabled: false,
                        // disabledOpacity: 0.5,
                        // speed: '0.1s',
                        // size: 'default'
                    });

                    if(config.after) {
                        config.after.apply($checkbox, arguments);
                    }

                    //$j.build("component").control["radio-options"].events.default.apply($j(this), [o]);
                },
                completed: function(o) {
                    if(config.completed) {
                        config.completed.apply($j(this), arguments);
                    }
                }
            });

            return $j(this);
        },
        events: {
            default: function(o) {

            }
        }
    }
};
