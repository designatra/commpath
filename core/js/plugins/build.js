import * as dj from '../../../core/js/frame.js';

(function($) {
	var plugin = {
		name:"build",
		methods: {},
		fragments: {},
		paths: {
			root:"buildables/"
		},
		source:{
			// TODO: should find a way to connect source filename and paths with node
			filename:"build.json",
			query:window.location.origin+":8080/buildable"
		},
		init:false,
		inventory:{},
		elements:{},
		packages:{},
		components: {},
		building: {},
		usage:{
			buildables:{
				count:0
			}
		},
		cache: {
			imported: {}
		}
	};
	plugin.source.path = plugin.paths.root + plugin.source.filename;

	plugin.methods.dom = {
		/*
			$j.el("papa").build()
		*/
		init: function(o, p, q) {
			var $el = jQuery(this);
			var $frag;

			$frag = overload(o, {
				"undefined": function() {
					plugin.init = true;
					$j("body").plugins(plugin.name, plugin);
				},
				/*
					Enables simplier interface with fragment (aka shorthand methods)

					Fragment Parameters:
						1. Name
						2. Data (array or object), Quantity
						3. After callback
						    AND/OR additional callbacks & parameters > Object of keyed options & callback functions
				*/
				"string":function() {
					var params = {
						name:o,
						data:p
					};

					/*
						If $j(el).fragment( ... ... ... ) receives >
					*/
					overload(q, {
						/*
							>  ONE or > TWO parameters:
								1. * Name (string)
								2. Quantity (integer)
								    or After Callback (function)

							$j.el("papa").fragment("item");

							$j.el("papa").fragment("item", 10);

							$j.el("papa").fragment("item", function() {
								$j.log("after", $j(this))
							});
						*/
						"undefined": function() {
							overload(p, {
								"number":function() {
									params.data = p;
								},
								"function": function() {
									params.data = 1;
									params.after = p;
								},
								"undefined": function() {
									params.data = 1;
								}
							})
						},
						/*
							> THREE parameters:
								1. * Name (string)
								2. * Data ([array] or {object}), Quantity (integer)
								3. * After Callback (function)

							$j.el("papa").fragment("item", 10, function() {
								$j.log("after", $j(this))
							});

							$j.el("papa").fragment("item",
								[{
									label:"dog"
								},
								{
									label:"cat"
								}],
								function(i, data) {
									$j.log("after", i, $j(this), data)
								}
							);
						*/
						"function": function() {
							params.after = q;
						},
						/*
							>  THREE parameters:
								1. Name (string)
								2. Data ([array] or {object}), Quantity (integer)
								3. Parameter's object > { callbacks, additional Parameters }

							$j.el("papa").fragment("item",
								[{
									label:"dog"
								},
								{
									label:"cat"
								}],
								{
									insert:"before",
									populate: function(i, data) {
										$j.log("populate", i, data);
									},
									completed: function(data){
										$j.log("completed", $j(this), data)
									}
								}
							);
						*/
						"object": function() {
							$j.each(q, function(name, callback) {
								params[name] = callback;
							});
						}
					}, $j(this));
					return $frag = $j(this).build(params);
				},
				"object": function(o) {
					o.data = overload(o.data, {
						/*
							Creates ONE fragment

							$j.el("papa").fragment({
								name:"item"
							})
						*/
						undefined: function() {
							return new Array(1);
						},
						/*
							Creates specified quantity of fragments > creates FIVE fragments

							$j.el("papa").fragment({
								name:"item",
								data:5
							})
						*/
						number: function() {
							return new Array(o.data);
						},
						/*
							Wraps object in array > Creates ONE fragment

							$j.el("papa").fragment({
								name:"item",
								data:{
									name:"michael",
									age:34
								}
							})
						*/
						object: function() {
							return new Array(o.data);
						},
						/*
							Creates fragment for each object in passed array  > creates TWO fragments
								TODO: if object is passed (vs array), what is the assumption?

							$j.el("papa").fragment({
								name:"item",
								data:[
									{
										name:"parrot",
										type:"animal"
									},
									{
										name:"dog",
										type:"animal"
									}
								]
							});
						*/
						default: function() {
							return o.data;
						}
					});

					/*
						Component Operations

						TODO:
						1. Abstract all this functionality
						2. Test how encapsulated the plugin.building = true/false
						     >> could have some recursion issues if not careful
					*/
					if(plugin.building[o.name]===true) {
						return $el.build("build", o, function(data) {
							plugin.building[o.name] = false;
						});
					}

					return $frag = $j.methods(util.type(o.name), {
						/*
							Data is preconfigured for element
							1. Get packaged [data]
							2. Build element(first part of package name) with [data]
						*/
						package: function() {
							plugin.building[o.name] = true;

							// Adds package name reference to each item. Otherwise Difficult to derive what elements belong to a package
							var items = _.map(util.package(o.name), function(xyz) {
								return overload(xyz, {
									function: function() {
										return xyz;
									},
									def: function() {
										return _.extend({"package":o.name}, xyz);
									}
								});
							});

							// Attempting to handle subtyped based packages (i.e. field.select.vehicle-criteria)
							var splitName = o.name.split("."),
								name = $j.methods(splitName.length, {
									// "action.button"
									2: function() {
										return splitName[0];
									},

									// "field.select.vehicle-criteria"
									3: function() {
										return splitName[0] + "." + splitName[1];
									}
								});

							return $el
								.build($j.extend(true, {}, o, {
									//name:o.name.split(".")[0],
									name:name,
									data:items
								}))
								// Packages return original context (parent) vs themselves so they can be easily chained
								.parent();
						},
						/*
							Redirects to alternate build method
							TODO: support multiple build methods for one component (card.creditCard > card.creditCard: build())
						*/
						component: function() {
							plugin.building[o.name] = true;

							var methods = $j.build(o.name);
							if(methods.build) {
								return methods.build.apply($el, [o.data, o]);
							}

							var methods = $j.mapTo(o.name, $j.build());
							if(methods && methods.build) {
								return methods.build.apply($el, [o.data, o]);
							}

							return $el.build("build", o);
						},
						/*
							Redirects to core components methods (Scripted Package)
							No element/package in inventory
						*/
						undefined: function() {
							var methods = $j.mapTo(o.name, $j.build());
							if(methods && methods.build) {
								return methods.build.apply($el, [o.data, o]);
							}
							return $el;
						},
						def: function() {
							return $el.build("build", o);
						}
					});
				}
			}, $el);

			// IF no parameters > $j.el("papa").fragment()
			if(!o) {				// THEN return all extension's method objects (TODO: for now) 		>>  Rethink what we return in this case
				return fragments;
			}

			// Make sure the building flag is reset
			// TODO: Test...not confident this is good, since this should take care of itself,
			// 		   but I think component scripts are causing the problem
			util.building(o, false);

			// OTHERWISE return the passed context
			return $frag;
		},
		/*
			Added for context convenience

			( functionality covered in $j.fragment("setup") )
			1. Imports fragments.json added to fragments/config.js
			2. Appends each fragment's styles to <head>
			3. Setups virtual dom

			$j.el("papa").build("setup", data, function(frags) {
				pageBuilder.apply($j.el("papa"));
			});
		*/
		setup: function(data, after) {
			return util.setup(data, after, $j(this));
		},
		/*
			Manually builds each fragment from the buffer
		*/
		build: function(o, after) {
			var $parent = $j(this);
			var $el;

			var dataLength = 1;
			if(o.data) {
				dataLength = o.data.length;
			}

			o.built = [];
			$j.each(o.data, function(i, iterationData) {
				$el = overload(iterationData, {
					"function": function() {
						return iterationData.apply(o.built.fromEnd()[0], [o.data[i-1], o])
					},
					def: function() {
						return $j.build("$", o.name);
					}
				});
				o.built.push($el);

				// Defines where to insert new fragment, default > "after"
				var insertionMethod = defined(o.insert, "after");
				if(insertionMethod == "before") {
					insertionMethod = "prependTo";
				} else {
					insertionMethod = "appendTo";
				}
				$el = $el[insertionMethod]($parent);

				// Tag buildable with unique ID
				var instanceID = $j.random();
				$el
					.attr("build-id", instanceID)
					.data(instanceID, $j.extend(true, {}, o, {
						instance: {
							id:instanceID,
							data: iterationData,
							index:i						// the iteration ID
						}
					}));
				// NOTE: This is to ease the search for meta data and allows for it to be more embedded in the code
				//       ...prefer over time to not affect the DOM if we dont need to > could just put in usage or inventory data store
				if(iterationData&&iterationData.meta) {
					$el.attr("meta", true);
				}

				// Tracks usage of fragments
				$el.build("usage", "inserted");

				/*
					1. POPULATE()

					Method (callback) runs and updates iteration's data with returned
				*/
				var populationData = overload(o.populate, {
					// Returns original iteration data or false
					"boolean": function() {
						if(o.populate===true) {
							// Autopopulate
							return iterationData;
						}
						// Don't autopopulate
						return false;
					},
					// Returns updated/overridden data
					"function": function() {
						return $j.extend(true, {}, iterationData, o.populate(i, iterationData));
					},
					// Returns original iteration data
					"undefined": function() {
						return iterationData;
					}
				});

				$el = $el.build("populate", populationData);

				/*
					2a. AFTER(i, iterationData)

					Method (callback) runs with each iteration, $j(context) is iteration's item
				*/
				if(o.after) {
					o.after.apply($el, [i, iterationData]);

					$el.build("usage", "populated", populationData);
				}

				/*
					2b. After > EVENTS

					If events have been registered to run after-after() callback. May come in multiple forms:
					1. string
					2. object
					3. array

					$j.el("papa").fragment("item", 1, {
						events:{
							after:"test1"
						}
					})

					events:{
						after:["test1", "test2"]
					}

					events:{
						after:{
							$:"body > papa",
							name:"test1"
						}
					}

					events:{
						after:[
							{
								$:"body > papa",
								name:"test1"
							},
							{
								name:"test2"
							}
						]
					}
				*/
				if(o.events && o.events.after) {
					$el.build("event", o.events.after, util.component(o.name));
				};

				/*
					2c. After > PLUGINS

					If a plugin or a list of plugins is specified (including init params) to run after each fragment
						PROCESS PIPING > runs after event init (after() THEN after events THEN plugins init)
					If an object is passed, the key > "$" allows a custom selector to be passed

					plugins: {
						after:"draggable"
					}

					plugins:{
						after:{
							name:"draggable"
						}
					}

					plugins:{
						after:[
							{
								name:"draggable"
							},
							{
								name:"droppable"
							}
						]
					}
				*/
				if(o.plugins && o.plugins.after) {
					privates.plugins(o.plugins.after, $el)
				}

				/*
					3a. COMPLETED(o)

					Method (callback) runs after last item is build, $j(context) is original parent
				*/
				if((i+1)===dataLength) {
					if(o.completed) {
						// TODO: old functionality didn't provide parent as context but inside returned data, adding deprecated functionality until reason through issues

						//o.completed.apply($parent, [o.data]);
						o.completed.apply($el, [{
							$parent: $parent,
							data: o.data
						}]);
					}

					/*
						3b. Completed > EVENTS

						If events have been registered to run after-completed() callback. May come in multiple forms:
						1. string
						2. object
						3. array

						 (refer to above after events for examples)
					*/
					if(o.events && o.events.completed) {
						$el.build("event", o.events.completed, util.component(o.name));
					}

					/*
						3c. Completed > PLUGINS

						If a plugin or a list of plugins is specified (including init params) to run after all fragments have been added to dom
						If an object is passed, the key > "$" allows a custom selector to be passed

						plugins: {
							completed:"draggable"
						}

						plugins:{
							completed:{
								$:"#sites action",
								name:"droppable"
							}
						}

						plugins:{
							completed:[
								{
									name:"draggable"
								},
								{
									name:"droppable"
								}
							]
						}
					*/
					if(o.plugins && o.plugins.completed) {
						privates.plugins(o.plugins.completed, $el)
					}
				}
				$el.build("usage", "completed");
			});

			// Callback meant for internal use > fires after all fragments built and populated
			// context is original parent
			if(after) {
				after.apply($el, [o]);
			}
			return $el
		},
		/*
			jQuery("product").fragment("populate", {
				description: "Sugar-Free Drink Sticks come in four delicious flavors",
				name: "Acai Lemonade Stevia Drink Sticks",
				price: "5.99",
				upc: 733739069924,
			});

			1. CONTENT:
				content="recommendation.name"
				content="alert.action.message&populate"

			2. MEDIA:
				media="backgroundImage:recommendation.image"

			3. ATTR:
				attr="id:alert.action.id"
				attr="class:alert.action.icon,id:alert.id"
				attr="class:alert.action.icon||alert.message.icon"

			4. SVG
				<div svg="class:icon"></div>  OR <icon><div svg="class:icon"></div></icon>
					BECOMES (original el with SVG attr is replaced)
						<svg class="arrow-38"><use xlink:href="#arrow-38"></use></svg>

			Current scans for the following attrs:
				1. content
				2. media
				3. attr
				4. svg
		*/
		populate: function(data) {
			// if data is set to FALSE, autopopulation should not run
			if(data===false) {
				return $j(this);
			}

			var operators = ["[content]","[media]", "[attr]", "[svg]"];
			$j(this)
				.find(operators.toString())
				.addBack("[content], [media], [attr]")
				.each(function(i, el) {
					var $el = $j(el);
					// privates.populate.operators
					$j.each(operators, function(i, term) {
						if($el.is(term)) {
							privates.populate.disect.apply($el, [term.replace(/\W/g, ""), data])
						}
					})
				});

			return $j(this);
		},
		/*
			$j(el).build("event", "field");

			$j(el).build("event", {
				name:"field"
			});

			$j(el).build("event", [
				{
					name:"field"
				},
				{
					name:"form"
				}
			])
		*/
		event: function(x, component) {
			return privates.event($j(this), x, component);
		},
		/*
			$el.build("usage")
			$el.build("usage", "inserted")
			$el.build("usage", "populated")

			$j.build("usage");


			data 	> 	after:function (i, o)
			stored		built:Array(4)
			on			data:Array(4)
			$el			events:Object
						instanceID:"92319200"
						name:"field"

			TODO: Packages are not reporting usage (only base element report)
		*/
		usage: function(event, o) {
			var data = $j(this).build("data"),
				name = data.name;

			var usage = plugin.usage;

			if(usage[name]===undefined) {
				usage[name] = {
					count:0,
					instances:{}
					// dependencies:[]
				};
			};

			var instances = usage[name].instances;
			$j.methods(event, {
				inserted: function() {
					usage[name].count++;
					usage.buildables.count++;
				},
				populated: function() {
					var populationData = overload(o, {
						function:function() {
							return $j(this).build("data").data;
						},
						object: function() {
							return o;
						}
					}, $j(this));

					instances[data.instanceID] = populationData;
				},
				// TODO: Dependencies arn't gonna work well since everything isn't already built
				// 		   However when they do work, the dependencies are def the most relevant
				completed: function() {
					// check for dependencies by looking for decendent elements with build-id
					var $dependencies = $j(this).build("dependencies");
					if($dependencies.length>0) {
						var dependencies = [];
						$dependencies.each(function() {
							dependencies.push($j(this).build("data").name);
						});
						usage[name].dependencies = _.uniq(dependencies);
					}
				}
			}, $j(this));
		},
		/*
			$el.build("data")
		*/
		data: function() {
			var buildID = $j(this).attr("build-id");
			if(!buildID) {
				return false;
			}
			return $j(this).data(buildID);
		},
		/*
			$j("ui").build("meta")

			$j("ui").build("meta", "element")
			$j("ui").build("meta", "tags")
		*/
		meta: function(x) {
			var instance = $j(this).build("data").instance.data;

			var meta = instance.meta;
			if(meta) {
				if(!x) {
					return meta;
				}
				return meta[x];
			}
			return false;
		},
		/*
			$el.build("name")
		*/
		name: function() {
			return $j(this).build("data").name;
		},
		/*
			$j("field").build("dependencies");

			Returns decendant buildables
			(semantics of this pattern are a little unintuitive)
		*/
		dependencies: function() {
			return $j(this).find("[build-id]");
		}
	};

	var util = plugin.methods.util = {
		// TODO: Evaluate util init > $j.fragment()
		init: function(x) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x]();
					}
					return privates.core(x);
				},
				object: function() {
					//return $j();
				},
				undefined: function() {
					// return privates.core()[x];
					return privates.core(x);
				}
			});

		},
		/*
			$j.build("usage");
			$j.build("usage", "field");
		*/
		usage: function(name) {
			var usage = plugin.usage;

			if(!name) {
				return usage;
			}
			return usage[name];
		},
		/*
			$j.build("id")
			$j.build("id", 34322432)
		*/
		id: function(id) {
			var $elements = $j("[build-id]");
			if(!id) {
				return $elements;
			}
			return $elements.filter("[build-id="+id+"]");
		},
		/*
			1. Import fragments (via node service)

			2. Processes imported json by:
				a. Adding each fragment's style tag to <head>
				b. Create buffered DOM from html (in memory)

			$j.build("setup", data, function(inventory) {
				$j.log(inventory)
			})

			util.setup(after, $el);
		*/
		setup: function(data, after, $el) {
			util.import(data, function(output) {
				var inventory = {};
				if(output.elements) {
					inventory = {
						elements:privates.addElements(output.elements),
						components:privates.addComponents(output.components)
					};
				}

				if(after) {
					if($el) {
						return after.apply($el, [inventory]);
					}
					return after(inventory);
				}

				return inventory;
			});
		},
		/*
			Requests JSON keyed as html/css for each included fragment

			$j.build("import", {
					elements:[
						"action",
						"action.button",
						{
							name:"icon",
							component:true
						}
					]
				},
				function(fragments) {
					$j.log(fragments)
				}
			);

			$j.build("import", function(fragments) {
				$j.log(fragments)
			});
		*/
		// import: function(after) {
		import: function(x, y) {
			var o = {
				type:"query",
				data:x,
				after: y
			};

			overload(x, {
				"object": function() {

				},
				"array": function() {

				},
				"function": function() {
					o.type = "file";
					o.data = false;
					o.after = this;
				}
			}, x);

			return privates.import(o, function(fragments) {
				if(o.after) {
					return o.after(fragments);
				}
			});
		},
		/*
			Returns a cloned fragment element from memory

			$j.build("$", "item");
		*/
		$: function(name) {
			var inventory = this.inventory();

			if(!name) {
				return $j();
			}

			var $html = inventory[name].$html;

			if(!$html) {
				if(util.package(name) && util.package(name).length>0) {
					var splitName = name.split(".");
					var name = $j.methods(splitName.length, {
						// "action.button"
						2: function() {
							return splitName[0];
						},

						// "field.select.vehicle-criteria"
						3: function() {
							return splitName[0] + "." + splitName[1];
						}
					})

					//return inventory[name.split(".")[0]].$html.clone();
					return inventory[name].$html.clone();
				}
			}
			return inventory[name].$html.clone();
		},
		/*
			$j.build("inventory")
			$j.build("inventory", "field")

			Should not set element or package data since this just combines plugin.elements + plugin.packages
			Does not return components
		*/
		inventory: function(name) {
			//var inventory = plugin.inventory;
			var inventory = $j.extend(true, {}, plugin.elements, plugin.packages)

			if(!name) {
				return inventory;
			}
			return inventory[name];
		},
		/*
			$j.build("type", "field")

			util.type("field")
		*/
		type: function(name) {
			var thing = util.inventory(name);

			return overload(thing, {
				// Element
				// maybe Component
				object: function() {
					var type = "element";
					if(thing.component) {
						type = "component";
					}
					return type;
				},
				// Package
				array: function() {
					return "package";
				}
			})
		},
		/*
			$j.build("element")
			$j.build("element", "form")

			util.element("form");
		*/
		element: function(name) {
			var elements = plugin.elements;
			if(!name) {
				return elements;
			}

			if(!elements[name]) {
				//elements[name] = {};
			}
			return elements[name];
		},
		/*
			$j.build("package")
			$j.build("package", "field.fullName")

			util.package("fields.fullName")
		*/
		package: function(name) {
			var packages = plugin.packages;  	//util.cache().packages;

			if(!name) {
				return plugin.packages;
			}

			if(!packages[name]) {
				plugin.packages[name] = {};
			}
			//return $j.mapTo(name, packages);
			return plugin.packages[name];
		},
		/*
			$j.build("component")
			$j.build("component", "card")

			util.component("card")
		*/
		component: function(name) {
			var components = plugin.components;

			if(!name) {
				return components;
			}
			return components[name]
		},
		/*
			$j.build("event")
			$j.build("event", {

			}, $el)

			util.event("field", $el)
		*/
		event: function() {

		},
		/*
			$j.build("ing")
			$j.build("ing", "card")
			$j.build("ing", "card", true)

			Fun alias for ing function
		*/
		ing: function(name, state) {
			return util.building(name, state);
		},
		/*
			$j.build("building")
			$j.build("building", "card")
			$j.build("building", {
				name:"card"
			}, true)
			$j.build("building", "card", true)

			util.building()
			util.building("card")
			util.building("card", false)

			TODO: Should probably set the building state through here
		*/
		building: function(x, state) {
			var building = plugin.building;
			if(!x) {
				return building;
			}

			var name = overload(x, {
				object: function() {
					return x.name;
				},
				string: function() {
					return x;
				}
			});

			if(!state && state!=false) {
				return building[name];
			}
			return building[name] = state;
		},
		/*
			$j.fragment("getMappedValue", "alert.action.icon||alert.message.icon", {...})
		*/
		getMappedValue: function (s, data) {
			if(!s) {
				return false;
			}

			// "alert.action.icon||alert.message.icon"
			var maps = s.split("||");
			// ["alert.action.icon", "alert.message.icon"]

			var value;
			if(maps.length>1) {
				$j.each(maps, function(i, map) {
					value = mapTo(map, data);

					// IF first value in mapping was defined in {data}
					if(value) {
						// THEN stop iterating through maps
						return false;
					}
				});
			} else {
				value = mapTo(maps[0], data);
			};

			return value;

			function mapTo(map, data) {
				return jQuery.mapTo(map.toString(), data);
			}
		},
		/*
			$j.build("cache")
			$j.build("cache", json)

			util.cache()

			TODO: Not the greatest setup
		*/
		cache: function(json) {
			var cache = $j.what("cache");
			if(!json) {
				return cache[plugin.name];
			}

			if(!cache) {
				cache = $j.what("cache", {});
			}

			if(!cache[plugin.name]) {
				var data = {};
				if(json) {
					data = json;
				}
				cache[plugin.name] = data;
			}
			return cache[plugin.name];
		}
	}

	/*
		Ideally these could created when fragment creates elements

		$j.build()
		$j.build("card")
		$j.build("card").build($parent, data)
	*/
	var privates = plugin.privates = {
		core: function(name) {
			// TODO: Check extension methods here
			var componentMethods = util.component(name);
			if(!componentMethods) {
				// return false;
				return util.component();
			}
			return componentMethods;
		},
		/*
			1. Specify which fragment in json
			2. Preprocess with a node service > one requests
				Returns json keyed by fragment name with html and style properties

			var o = {
				type:"query",
				data:x,
				after: y
			};
		*/
		import: function(o) {
			var path = $j.methods(o.type, {
				query: function() {
					return plugin.source.query;
				},
				file: function() {
					return plugin.source.path;
				}
			});

			// import(/* webpackChunkName: "print" */ './print').then(function(module){
			// 	var print = module.default;
			//
			// 		print();
			// });
			// $j.getJSON(path, o.data, function(json) {
			$j.ajax({
					method:"POST",
					url:path,
					contentType:'application/json; charset=utf-8',
					data:JSON.stringify(o.data),
					dataType:"json"
				})
				.done(function(data) {
					plugin.cache.imported = $j.build("cache", data);
				})
				.fail(function() {

				})
				.always(function(data) {
					if(o.after) {
						return o.after(data);
					}
				});
		},
		/*
			privates.addElements(fragments);
		*/
		addElements: function(elements) {
			privates.addStyle("pixel", $j.what("cache").build.styles);

			$j.each(elements, function(name, dom) {
				privates.addElement(name, dom);
			});

			return $j.build("inventory");
		},
		/*
			privates.addElement(elementName, dom);
		*/
		addElement: function(name, dom) {
			//privates.addStyle(name, dom.style)

			dom.$html = $j(dom.html);

			// Initialize all component's building state to false (aids in identifying when fragment reroutes to component loop)
			plugin.building[name] = false;

			plugin.elements[name] = dom;
			plugin.inventory[name] = dom;

			if(dom.component) {
				privates.addComponent(name, dom.component);
			}

			if(dom.packages) {
				privates.addPackages(name, dom.packages);
			}
		},
		/*
			privates.addPackages(elementPackages);

			TODO: Figure out how to init and insert external scripts without
				       globalizing packages.field in director.core.js
		*/
		addPackages: function(baseElementName, packages) {
			$j.each(packages, function(name, script) {
				privates.addPackage(baseElementName, name, script);
			});
		},
		addPackage: function(baseElementName, packageName, script) {
			var name = baseElementName+"."+packageName;

			privates.addScript(name, script)
		},
		/*
			privates.addComponents(components);
		*/
		addComponents:function(components) {
			$j.each(components, function(name, script) {
				privates.addComponent(name, script);
			});
			return components;
		},
		/*
			privates.addComponent(name, dom);
			privates.addComponent(name, package);

			{
				name:"field.firstName",
				component: true
			},
		*/
		addComponent: function(name, script) {
			if(script) {
				privates.addScript(name, script)
			}
		},
		/*
			privates.addStyle("<style>....</style>");

			TODO: Why does addStyle get css already wrapped with <style> tags but script doesn't?
				       Either should happen in import.js or happen here
		*/
		addStyle: function(name, style) {
			return $j(style).insertBefore($j("head").find("script:first"))
		},
		/*
			privates.addScript("js");
		*/
		addScript: function(name, script) {
			return $j("<script>" + script + "</script>")
				.attr("id", name)
				.insertAfter($j("head").find("script:last"));
		},
		/*
			privates.event($el, "field")

			privates.event($el, {
					name:"field"
			})

			privates.event($el, [
				{
					name:"field"
				},
				{
					name:"form",
					$:"form"
				}
			]);
		*/
		event: function($el, x, component) {
			if(!component) {
				return false;
			}

			var events;
			if(component && component.events) {
				events = component.events;
			}
			if(!events) {
				return false;
			}

			return overload(x, {
				"string":function() {
					return events[x].apply($el, [component])
				},
				"object": function() {
					var $selector = $el;
					if(x.$) {
						$selector = $j(x.$)
					}

					return events[x.name].apply($selector, [component])
				},
				"array": function() {
					$j.each(x, function() {
						privates.event($el, this, component);
					});
				}
			});
		},
		/*
			privates.plugins("draggable", $frag)

			privates.plugins({
				name:"draggable"
			}, $frag)

			privates.plugins([
				{
					name:"draggable"
				},
				{
					$:"#sites action",
					name:"droppable"
				}
			], $frag)
		*/
		plugins: function(plugins, $frag) {
			overload(plugins, {
				"string":function() {
					if($frag[plugins]) {
						return $frag[plugins]();
					}
				},
				"object": function() {
					var $selector = $frag;
					if(plugins.$) {
						$selector = $j(plugins.$)
					}
					if($selector[plugins.name]) {
						return $selector[plugins.name](plugins);
					}
					$j.log("Plugin Not Found > "+plugins.name)
				},
				"array": function() {
					$j.each(plugins, function() {
						privates.plugins(this, $frag);
					});
				}
			});
		},
		/*
			privates.populate[markup]

		*/
		populate: {
			// privates.populate.disect.apply($el, [term, data])
			disect: function(term, data) {
				var $el = $j(this),
					attrs = $el.attr(term);

				// "class:alert.action.icon,id:alert.id"
				var operations = attrs.split(",");
				// ["class:alert.action.icon", "id:alert.id"]
				$j.each(operations, function(i, operation) {
					// ["class:alert.action.icon"]
					var attr = operation.split(":");
					// ["class", "alert.action.icon"]

					var method = privates.populate.operators[term];
					if(method) {
						method($el, attr, data);
					}
				});

				privates.populate.archive($el, term, attrs);
			},
			/*
				privates.populate.archive($el, term, attrs)

				Copies terminology markup from dom elements to dom data, THEN calls clean method
			*/
			archive: function($el, term, attrs) {
				var data = $el.data("build");
				if(!data) {
					data = $el.data("build", {}).data("build");
				}

				data[term] = attrs;

				return privates.populate.clean($el, term);
			},
			/*
				privates.populate.clean($el, term)

				Strips terminology markup from dom element, (after it has been transfered to data)
			*/
			clean: function($el, term) {
				return $el.removeAttr(term);
			},
			/*
				privates.populate.valid(string)
			*/
			valid: function(s) {
				// IF string has illegal characters
				// Matches anything but letters, digits and underscores. Equivalent to [^A-Za-z0-9_].
				if(s.match(/\W/g)!==null) {
					return false;
				}
				return s;
			},
			/*
				privates.populate.operators[term].apply($el, [attr, data])

				TODO: Remove brackets around each of the operators method names
			*/
			operators:{
				/*
					privates.populate.operators["[content]"](["recommendation.name"], {...})

					Incoming attr will only have one value, since it's always content (vs. attr which have 2: property, value)
				*/
				content:function($el, attr, data) {
					// Valid() if still even needed needs to be rethought
					//if(privates.populate.valid(attr[0])!==false) {
						return $el.html($j.build("getMappedValue", attr[0], data));
					//}
				},
				/*
					privates.populate.operators["[svg]"](["class", "icon"], {...})

					Incoming attr will have TWO values, but only the data map (attr[1]) will be used
				*/
				svg: function($el, attr, data) {
					var value = $j.build("getMappedValue", attr[1], data);
					return $el.replaceWith("<svg class='"+value+"'><use xlink:href='#"+value+"'></use></svg>");
				},
				/*
					privates.populate.operators["[media]"](["backgroundImage", "recommendation.image"], {...})

					Incoming attr will have TWO values, first value is css property, second is mapped data value
					TODO: rename CSS?
				*/
				media: function($el, attr, data) {
					if(privates.populate.valid(attr[0])!==false) {
						return $el.css(attr[0], $j.build("getMappedValue", attr[1], data));
					}
				},
				/*
					privates.populate.operators["[attr]"](["id", "alert.action.icon"], {...})

					Incoming attr will have TWO values:first value is property/attribute name, second is mapped data value
				*/
				attr: function($el, attr, data) {
					var value = $j.build("getMappedValue", attr[1], data);

					// certain [attr] require specific jquery setter methods to run, IE class
					return $j.methods(attr[0], {
						"class": function() {
							return $j(this).addClass(value);
						},
						def: function() {
							if(privates.populate.valid(attr[0])!==false) {
								return $j(this).attr(attr[0], value);
							}
						}
					}, $el);
				}
			}
		}
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
