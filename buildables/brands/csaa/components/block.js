$j.build("component")["block"] = {
	/*
		COMPONENT: "block"

		$el.build("block")
	*/
	build: function(data, config) {
		$j(this).build("action.block", defined(data, 1), {
			populate: function(i, o) {
				if(config.populate) {
					return config.populate.apply($j(this), arguments);
				}
			},
			after: function(i, o) {
				var $el = $j(this);

				// if(o.policy) {
				// 	var policy = overload(o.policy, {
				// 		string: function() {
				// 			return {
				// 				label: o.policy
				// 			}
				// 		},
				// 		object: function() {
				// 			return o.policy;
				// 		}
				// 	});
				//
				// 	$j(this).build("data").instance.data.policy = policy;
				// }

				if(config.after) {
					config.after.apply($el, arguments);
				}

				$j.build("component")["block"].events.default.apply($el, [o]);
			},
			completed: function(o) {
				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}
			}
		});
	},
	/*
		$card.build("block.email,vehicle", {
	        email:"mr.kool@gmail.com",
	        vehicles:[
		        "2013 BMW X1",
		        "2006 Dodge Durango SLT"
	        ]
        });
	*/
	"email,vehicle":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					utils.populate(block, {
						primary:"email",
						map:{
							line4:block.vehicles
						},
						feature:"drop_down"
					});
				},
				after: function(i, o) {
					utils.build.pills(
						utils.sel.$things($j(this)).eq(3),
						o.line4,
						"vehicle")
					;
				}
			});
		}
	},
	/*
		$parent.build("block.policy,vehicle", {
			policy:"CAAS123456789",
			vehicles:[
				"2013 BMW X1",
				"2006 Dodge Durango SLT"
			]
		})
	*/
	"policy,vehicle":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					utils.populate(block, {
						primary:"policy",
						map:{
							line4:block.vehicles
						},
						feature:"switch"
					});
				},
				after: function(i, o) {
					utils.build.things(
						utils.sel.$things($j(this)).eq(3),
						o.line4
					);
				}
			});
		}
	},
	/*
		$parent.build("block.policy,vehicle,phone", {
	        policy:"CAAS123456789",
	        vehicles:[
		        "2013 BMW X1",
		        "2006 Dodge Durango SLT"
	        ],
	        phones:[
	            "555.111.1111",
		        "555.222.2222"
	        ]
        });
	*/
	"policy,vehicle,phone":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"policy",
						map:{
							line3:block.vehicles,
							line4:block.phones
						},
						feature:"drop_down"
					});
				},
				after: function(i, o) {
					var $things = utils.sel.$things($j(this));

					utils.build.things(
						$things.eq(2),
						o.line3
					);

					utils.build.pills(
						$things.eq(3),
						o.line4
					);
				}
			});
		}
	},
	/*
		$parent.build("block.policy,property", {
			policy:"CAAS123456789",
			property:"1890 Circle Drive <br> Walnut Creek, CA 94553"
		})
	*/
	"policy,property":{
		build: function(data, config) {
			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"policy",
						map:{
							line4:block.property
						},
						feature:"switch"
					});
				}
			});
		}
	},
	/*
		$parent.build("block.policy,property,phone", {
			policy:"CAAS123456789",
			property:"1890 Circle Drive <br> Walnut Creek, CA 94553",
			phones:[
		        "555.111.1111",
		        "555.222.2222"
	        ]
		})
	*/
	"policy,property,phone":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					utils.populate(block, {
						primary:"policy",
						map:{
							line3:block.property,
							line4:block.phones
						},
						feature:"drop_down"
					});
				},
				after: function(i, o) {
					var $things = utils.sel.$things($j(this));

					utils.build.things(
						$things.eq(2),
						o.line3
					);

					utils.build.pills(
						$things.eq(3),
						o.line4
					);
				}
			});
		}
	},
	/*
		$parent.build("block.vehicle", {
			vehicle:"2006 Honda Accord"
		});
	*/
	"vehicle":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"vehicle",
						map:{
							line4:block.financing,
							layout: {
								columns: {
									3: {
										action:"remove"
									}
								}
							}

						}
					});
				},
				after: function(i, o) {
					// NOTE: By itserting before other vehicles, we can assume it is new (for now at least)
					if(config.insert=="before") {
						// NOTE: So horrible that I chose to map and map and map because now I can use core build shortcuts like insert:before
						var $new_vehicle = $j(this).prependTo($j(this).parent())

						var $things = utils.sel.$things($new_vehicle);
						// utils.build.pills(
						// 	$things.eq(3),
						// 	["pending"],
						// 	"driver"
						// );

						$things.eq(3).build("pill", {
							state:"saber",
							label:"pending"
						})
					}
				}
			});
		}
	},
	/*
		$parent.build("block.vehicle,financing", {
			vehicle:"2006 Honda Accord",
			financing:"owned"
		});
	*/
	"vehicle,financing":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"vehicle",
						map:{
							line4:block.financing,

						},
						feature:{
							type:"drop_down"
						}
					});
				},
				after: function(i, o) {

				}
			});
		}
	},
	/*
		$parent.build("block.vehicle,info,drivers", {
			vehicle:"2006 Honda Accord",
			info:"Assign one driver per vehicle",
			drivers:[
		        "Tina,
		        "Barnabus"
	        ]
		});
	*/
	"vehicle,info,drivers":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"vehicle",
						map:{
							line3:block.info,
							line4:block.drivers,
							layout: {
								columns: {
									3: {
										action:"edit"
									}
								}
							}
						},
						feature:{
							type:"drop_down",
							//icon:"oneui-android-add-circle",
							id:"assign_vehicle"
						}
					});
				},
				after: function(i, o) {
					var $things = utils.sel.$things($j(this));

					utils.build.pills(
						$things.eq(3),
						o.line4
					);

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
		}
	},
	/*
		$parent.build("block.add_vehicle");
	*/
	"add_vehicle":{
		build: function(data, config) {
			var utils = $j.build("component")["block"].utils;

			$j(this).build("block", data, {
				populate: function(i, block) {
					$j.build("component")["block"].utils.populate(block, {
						primary:"title",
						map:{
							line4:defined(block.tagline, "Tell us about this vehicle…")
						},
						feature:{
							type:"drop_down",
							icon:"oneui-android-add-circle",
							element:"drop_down.add_vehicle"
						}
					});
				},
				after: function(i, o) {
					if(config.after) {
						config.after.apply($j(this), arguments);
					}
				}
			});
		}
	},
	events: {
		default: function(o) {
			$j(this).on({
				click: function(e) {
					$j(this).trigger("update", $j.what("updates"))
				},
				update: function(e, updates) {
					var instance = $j(this).build("data").instance.data;

					var diffs = $j.diff.map(updates, instance);
					$j.each(diffs, function(entity) {
						if(this.type) {
							return types({
								entity: entity,
								prop: null,
								diff: this
							})
						}

						$j.each(this, function(prop, diff) {
							types({
								entity: entity,
								prop: prop,
								diff: this
							})
						})
					});

					function types(o) {
						// EXCLUDE icon
						if(o.prop && o.prop=="icon") {
							return false;
						}

						// INCLUDE label, array indexes (0,1)
						$j.methods(o.diff.type, {
							// created: function() {
							// 	$j.log("CREATED > ", o.entity, o.prop, this);
							// },
							// updated: function() {
							// 	$j.log("UPDATED > ", o.entity, o.prop, this);
							// },
							// deleted: function() {
							// 	$j.log("DELETED > ", o.entity, this);
							// },
							unchanged: function() {
								$j.log("NO CHANGES")
							},
							def: function() {
								$j.log("CHANGES > ", o.entity, o.prop, this);
							}
						}, o.diff.data);


					}
				}
			})
		}
	},
	utils:{
		build: {
			/*
				$j.build("component")["block"].utils.build.things($things.eq(2), [
			        "2013 BMW X1",
			        "2006 Dodge Durango SLT"
		        ]);
			*/
			things: function($block, things) {
				var util = this;

				var things = overload(things, {
					string: function() {
						return [things];
					},
					array: function() {
						return things;
					}
				});

				var $line = $block.empty();
				$j.each(things, function(i, thing) {
					if(i+1<things.length) {
						thing = thing+",";
					}

					util.thing($line, thing);
				});
			},
			/*
				$j.build("component")["block"].utils.build.thing($things.eq(2), "2006 Dodge Durango SLT");
			*/
			thing: function($line, thing) {
				return $line.build("thing", {
					label:thing
				});
			},
			/*
				$j.build("component")["block"].utils.build.pills($things.eq(3), [
					"2013 BMW X1",
					"2006 Dodge Durango SLT"
				]);

				$j.build("component")["block"].utils.build.pills($things.eq(3), [
					"2013 BMW X1",
					"2006 Dodge Durango SLT"
				], "vehicle");

				$j.build("component")["block"].utils.build.pills($things.eq(3), [
					{
						state:"grey-4",
						icon:"vehicle",
						label:"2013 BMW X1"
					},
					{
						icon:"vehicle",
						label:"2006 Dodge Durango SLT"
					}
				]);

				$j.build("component")["block"].utils.build.pills($things.eq(3), [
					{
						label:"2013 BMW X1"
					},
					{
						label:"2006 Dodge Durango SLT"
					}
				], "vehicle");
			*/
			pills: function($block, pills, type) {
				var get_icon = $j.build("component")["block"].utils.icon,
					util = this;

				var $line = $block.empty();

				/*
					TODO: If Design is verified, should redo this with CSS (or redo all action blocks)
						  ( Micah's design have the pill slide under the col1 which is not easily done with the current action block design )
			    */
				var $col1 = $line.parent().prev();
				if($col1.is(":visible")){
					$line.css({
						marginLeft:-1*$col1.width()
					});

					var height = 0;
					$line.prevAll(":visible").each(function() {
						height = height + $j(this).outerHeight(true);
					});
					$col1.height(height);
				}

				$j.each(pills, function(i, pill) {
					var o = overload(pill, {
						string: function() {
							this.label = pill;

							return this;
						},
						object: function() {
							this.icon = get_icon($j.extend(this, pill).icon);

							return this;
						}
					}, {
						theme:"grey-4",
						icon:get_icon(), //vehicle, property > def: oneui-circle-full
						label:""
					});

					if(o.primary) {
						o.theme = "saber";
					}

					if(type) {
						o.icon = get_icon(type);
					}

					if(pill.active!==false) {
						util.pill($line, o);
					}
				});
			},
			/*
				$j.build("component")["block"].utils.build.pill($things.eq(3), "2013 BMW X1");
				$j.build("component")["block"].utils.build.pill($things.eq(3), {
					state:"grey-4",
					icon:"oneui-core-auto",
					label:"2006 Dodge Durango SLT"
				});
			*/
			pill: function($line, pill) {
				return $line.build("pill", pill);
			}
		},
		/*
			$j.build("component")["block"].utils.populate(block, {
				primary:"policy",
				map:{
					line4:block.property
				},
				feature:"switch"
			});
	    */
		populate: function(o, opts) {
			return $j.extend(true,
				o,
				this.config(opts.feature, this.flatten(o, opts.primary, opts.map))
			);
		},
		/*
			$j.build("component")["block"].utils.flatten(block, "policy", {
				line4:block.vehicles
			});
		 */
		flatten: function(x, key, o) {
			var data = x[key];

			return overload(data, {
				string: function() {
					this.line1 = data;

					return this;
				},
				object: function() {
					this.line1 = data.label;

					if(data.icon) {
						this.icon = $j.build("component")["block"].utils.icon(data.icon)
					}

					return this;
				}
			}, o);
		},
		/*
			$j.build("component")["block"].utils.config("switch", {
				line1:"CAAS123456789",
		        line4:[
			        "2013 BMW X1",
			        "2006 Dodge Durango SLT"
		        ]
			})
		 */
		config: function(def_id, o) {
			var def = $j.build("component")["block"].utils.def;

			var feature = overload(def_id, {
				string: function() {
					return def[def_id](def_id)
				},
				object: function() {
					return def[def_id.type](def_id)
				}
			})
			//var util = $j.build("component")["block"].utils.def[def_id]()

			return $j.extend(true, {}, defined(feature,{}), o);
			//return $j.extend(true, {}, defined($j.build("component")["block"].utils.def[def_id](),{}), o);
		},
		def: {
			/*
				$j.build("component")["block"].utils.def.switch()
			 */
			switch: function() {
				return {
					plugin: {
						switch:true
					},
					layout:{
						columns:{
							3:{
								switch:true
							}
						}
					}
				}
			},
			/*
				$j.build("component")["block"].utils.def.drop_down(element);
			*/
			drop_down: function(config) {
				var x = config;
				if(!config.icon) {
					x = "edit";
				};

				return {
					action:"drop_down",
					plugin:{
						drop_down:{
							// TODO: email_change is not a good default drop down component
							element:defined(config.element, "drop_down.generic")
						}
					},
					layout:{
						columns:{
							3:{
								action:x
							}
						}
					}
				}
			}
		},
		/*
			$j.build("component")["block"].utils.sel.$things($j(this));
		 */
		sel: {
			$things: function($el) {
				return $el.find(">wrapper>wrapper:eq(1)>thing");
			}
		},
		/*
			$j.build("component")["block"].utils.icon("vehicle");

			TODO: Extract this utility into something that we can commonly use accross all components/extensions
				  Wherever and whatever that utility looks like, it should get it's mapped icon classes via json
		*/
		icon: function(id) {
			return prefix($j.methods(id, {
				vehicle: function() {
					return "core-auto";
				},
				driver: function() {
					return "core-male";
				},
				driver2: function() {
					return "core-male-driver";
				},
				property: function() {
					return "core-home";
				},
				phone_mobile: function() {
					return "mobile-1";
				},
				phone_home: function() {
					return "core-telephone";
				},
				phone_work: function() {
					return "briefcase";
				},
				def: function() {
					return "circle-full";
				}
			}));

			function prefix(icon_class) {
				return "oneui-"+icon_class;
			}
		}
	}
};