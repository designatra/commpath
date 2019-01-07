$j.build("component").card = {
	/*
		COMPONENT: "card"

		$el.build("card", {
			title:"credit card"
		})

		$body.build("card.mypolicy-paperless_pref-edit", {
			id:"paperless_pref-edit",
			header:{
				icon:"oneui-core-auto",
				title:"2013 BMW X1",
				line2:"CAAS123456789"
			},
			paperless:paperless
		});

		$parent.build("card.withForm", {
				id:"vehicles",
				visible:"false",
				header:{
					title:"add a vehicle",
					instruction:"To help you get started tell us about this vehicle…"
				}
			},
			{
				layout:"col-1"
			});
	*/
	build: function(data, config) {
		var $body = $j(this)
			.build("card", data, {
				events: function() {
					if(config.events) {
						return config.events;
					}
				},
				//populate: defined(config.populate, function() {})
				populate: function(i, o) {
					if(config.populate) {
						return config.populate.apply($j(this), arguments);
					}
				},
				//after: defined(config.after, function() {}),
				after: function(i, o) {
					var $body= $j(this).find("wrapper#body");
					
					// NOTE: Still experimenting with how to utlize/allow some elements to actually be fragments  (chunks of html to insert)
					// NOTE: Experimenting with fragment of html in card.paperless_pref-view.html
					if(config.fragment&&config.fragment.body) {
						$body.build(config.fragment.body, o, function(i, o) {
							var $card = $j(this).parent();
							config.after.apply($card, arguments);
						})
					} else {
						if(config.after) {
							// NOTE: Since cards have header content handled by component, the card body element is being returned instead					
							config.after.apply($body, arguments);
						}
					}

					// Designs suggest that card headers may contain a pill as a common pattern
					var pill = $j.findKey(o, "pill");
					if(pill) {
						var $pillParent = $j(this);
						if(pill.selector) {
							$pillParent = $pillParent.find(pill.selector);
						} else {
							$pillParent =$pillParent.find("wrapper#header > wrapper[position=right]");
						}
						$pillParent.build("pill", pill);
					}

					$j.build("component").card.events.default.apply($j(this), [o]);
				}
			})
			.find("wrapper#body");

		if(config.layout) {
			$body.attr("layout", config.layout);
		}

		return $body;
	},
	events: {
		default: function() {
			$j(this).on({
				"show.card": function(e) {
					$j(this)
						.attr("visible", true)
						.siblings("card[visible]").trigger("hide.card");
				},
				"hide.card": function(e) {
					$j(this).attr("visible", false);
				},
				"showPrompt.panel": function(e) {
					//	$j(this).find("panel[type=prompt]").trigger("show.panel");
				},
				reset:function(e) {
					$j(this)
						.find("wrapper#header wrapper[position=left] > label")
						.text($j.el("card", $j(this).attr("id")).build("data").instance.data.header.title);
				}
			});
		}
	},
	/*
		$ui.build("card.withForm", {
			id:"nav_buttons",
			header:{
				title:"navigation buttons"
				instruction:"To help you get started tell us about this vehicle…"
			},
			visible:"true"
		});

	*/
	withForm:{
		build: function(data, config) {
			var $fields = $j(this)
				.build("card", data)
				.build("form")
				.build("fields");
				
			$fields.attr("layout", defined(config.layout, "col-1"));

			return $fields;
		}
	},
	withActions:{
		build: function(data, config) {
			return $j(this).build("card", data, {
				populate: function(i, o) {
					// o.header = {
					// 	title:o.policy.type + " Policy",
					// 	line2:o.policy.id,
					// 	line3:"Policy Period "+o.policy.period
					// }
				},
				after: function(i, o) {
					 $j(this).build("action.block", o.actions, {
						populate: function(i, o) {
							// TODO: Address the evolving abstraction of how we will populate action blocks. This manual data mapping is not sustainable 			
							// var vehicle = o.vehicle;
							// o.for = "vehicle";
							// if(vehicle) {
							// 	o.icon = vehicle.icon;
							// 	o.line1 = vehicle.line1;
							// 	o.line3 = vehicle.line2;
							// }
						}
					});
				}
			});
		}
	},
	creditCard: {
		/*
			$el.build("card.creditCard")
		*/
		build: function(data, config) {
			return $j(this)
				.build("card", {
					title:"credit card"
				})
				.build("form")
				.build("fields")
				.build("field.creditCard")
				.closest("card");
		}
	},
	bankAccount: {
		/*
			$el.build("card.bankAccount")
		*/
		build: function(data, config) {
			return $j(this)
				.build("card", {
					title:"checking account"
				})
				.build("form")
				.build("fields")
				.build("field.bank")
				.closest("card");
		}
	},
	address: {
		/*
			$el.build("card.address")
		*/
		build: function(data, config) {
			return $j(this)
				.build("card", {
					title:"street address"
				})
				.build("form")
				.build("fields")
				.build("field.address")
				.closest("card");
		}
	},
	contactInfo: {
		build: function(data, config) {
			return $j(this)
				.build("card.withForm", {
					title:"contact info"
				})
				.build("field.contactInfo");
		}
	},
	// TODO: After doing a few cards, with action blocks, might want to consolidate functionality
	"mypolicy-payments": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				after: function(i, o) {
					$j(this).build("action.block", o.actions, {
						populate: function(i, o) {					
							var policy = o.policy;
							var premium = accounting.toFixed(policy.premium, 2);
							//o.policy.premium = "<b>$</b>" + premium;
							o.line1 = "<b>$</b>" + premium;
							o.line2 = policy.id;
							o.line3 = policy.date_due;
							// o.line4 = o.comment;

							// o.for = "payments";
						},
						completed: function(o) {
							o.$parent.build("action", {
								label:"pay all",
								icon:"oneui-core-arrow-right"
							}, function() {
								$j(this).attr("theme", "all");
							});
						}
					});
				}
			});
		}
	},
	"mypolicy-claims": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				after: function(i, o) {
					$j(this).build("action.block", o.actions, {
						populate: function(i, o) {	
							var claim = o.claim;
		
							// NOTE: If logic allows each action block in claims to provide details or act as an information block (if it doesn't have a claim object) 
							if(claim) {							
								var claim = $j.extend({
									layout: {
										columns:{
											1:{
												icon:claim.icon
											}
										}
									}
								}, o.claim);
								claim.line1 = claim.id;
								return claim;
							}
						},
						after: function(i, o){
							var claim = o.claim;
							if(claim && claim.status) {
								var $things = $j(this).find(">wrapper>wrapper>thing");
								$things.eq(1).build("thing.status", {
									status:claim.status
								});
							}
						}
					});
				}
			});
		}
	},
	"mypolicy-auto_policy": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				populate: function(i, o) {
					o.header = {
						title:o.policy.type + " Policy",
						line2:o.policy.id,
						line3:"Policy Period "+o.policy.period
					}
				},
				after: function(i, o) {
					 $j(this).build("action.block", o.actions, {
						populate: function(i, o) {
							// TODO: Address the evolving abstraction of how we will populate action blocks. This manual data mapping is not sustainable 			
							// var vehicle = o.vehicle;
							// o.for = "vehicle";
							// if(vehicle) {
							// 	o.icon = vehicle.icon;
							// 	o.line1 = vehicle.line1;
							// 	o.line3 = vehicle.line2;
							// }

							return o.vehicle;
						}
					});

					if(o.policies) {
						 $j(this).build("carousel.card_selector");
					}
				}
			});
		}
	},
	"mypolicy-smarttrek": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				after: function(i, o) {
					$j(this).build("action.block", o.actions, {
						populate: function(i, o) {
							// NOTE: Added isAction = true to helpp action.block component identify when building from an item in o.actions
							o.isAction = true;
						}
					});
				}
			});
		}
	},
	"mypolicy-proof_of_insurance": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				after: function(i, o) {
					$j(this).build("action.block", o.actions, {
						populate: function(i, o) {	
							return o.policy;
						}
					});
				}
			});
		}
	},
	// TODO: Paperless card states need to be rethought...and events moved since it's confusing where to put edit events --shizzz
	"mypolicy-paperless_pref-view": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				fragment:{
					// NOTE: The html content from the following element will be appened to the card just built (returns the parent context which, I believe is the $card)
					body:"card.paperless_pref-view"
				},
				after: function(i, o) {
						$j(this)
							.children("wrapper#settings").find("column#visibility")
								.build("action", {
									action:"visibility",
									icon:"oneui-core-arrow-down",
									plugin:{
										drop_down:{
											// Drop down plugin is initiated by the action that toggles items visibility (vs when it's a full blown action block )
											items:{
												init_state:"expanded",
												selector: "[dropdown=notification_settings]"
											}
										}
									},
									on: {
										click: function(e, instance) {
											// TODO: Kinda confusing since this is an action so we go and look in the action component events and there isn't any js for dropdowns
											$j(this).closest("wrapper[type=table]").trigger({
												type:"toggle.dropdown",
												instance:instance
											});
										}
									}
								}
							);

						//TODO: Clunky until building rows dynamically
						$j(this).find("wrapper[type=table]#settings row:not(#header) column#edit > wrapper").each(function() {
							$j(this)
								.build("action", {
									action:"edit",
									label:"edit",
									on:{
										click: function() {
											$j.what("router").navigate("settings/paperless/edit");
										}
									}
								});
						});
				}
			});
		}
	},
	"mypolicy-paperless_pref-edit": {
		build: function(data, config) {
			return $j(this).build("card", data, {
				fragment:{
					body:"card.paperless_pref-edit"
				},
				after: function(i, o) {
					$j(this).find("wrapper > wrapper#controls").each(function() {
						buildChannelSelectionControl($j(this)); 
					});

					// NOTE: Building out the notification and alerts associated with billing
					$j(this).find("wrapper#billing  #more").build("wrapper", [
							{
								label:"Payment reminders"
								// NOTE: Have contextual label > "also email me" in the css for now (should NOT be there)
							},
							{
								label:"Payment confirmations"
							}
						], function(i, o) {
							$j(this).build("thing", o)
							$j(this).build("control.toggle", o);
						});

					var $grey = $j(this).find("wrapper#grey"),
						$email = $grey.find("wrapper#email");
					$email.build("thing", {
						title: "change email",
						id:"title"
					});
					$email.build("field.email");

					$grey
						.find(">#buttons > wrapper").attr("layout", "col-2")
						.build("action.button", [
								{
									id:"cancel",
									label:"cancel",
									// TODO: Consider using theme concepts on buttons
									class:"secondary",
									on:{
										click: function() {
											$j.what("router").back();
										}
									}
								},
								{
									id:"save",
									label:"save",
									class:"primary-yellow",
									on:{
										click: function() {
											$j.what("router").back({
												updated:"the thing"
											});
										}
									}
								}
							],
							{
								populate:function(i, data) {
									data.layout = "col-"+1
								}
							}
						);
				}
			});

			function buildChannelSelectionControl($parent) {
				$parent.build("control.radio-options", {
					id:"delivery_channel",
					buttons:[
						{
							class:"secondary",
							action:"postal",
							label:"us mail"
						},
						{
							class:"secondary",
							action:"email",
							label:"email",
							active:"true"
						}
					]
				});			
			}
		}
	}
};
