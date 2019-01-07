/*
	Frame Extended Functions
*/
jQuery.extend({
	/*
		$j.designer();
		$j.designer("data");

		$j.designer("product", "bag 1");
		$j.designer("addProduct", "bag 1");
		$j.designer("addProduct", "bag 1", {
			views:[
				{
					title:partName,
					environment:"3d",
					thumbnail:"images/products/"+name(lineName)+"/"+name(typeName)+"-"+name(itemName)+"/"+partName+"-preview.png",
					options:null,
					elements:[]
				},
				{
	
				}
			],
			category:"bean bags"
		});
	*/
	designer: function(x, title, z) {

		var data = $j.what("designer"),
			designer = $j("#clothing-designer").data().fancyProductDesigner;
		
		var get = {
			product: function() {
				return data.products[title];
			}
		}

		return $j.methods(x, {
			undefined: function() {
				return designer;
			},
			data: function() {
				return $j.what("designer")
			},
			/*
				$j.designer("history", "productCreate")
			*/
			history: function() {
				var events = $j.what("clara").events;
				if(!title) {
					return events;
				}
				events = events[title];
				if(!events[0]) {
					return false;
				}
				
				var lastEvent;
				if(events.length===1) {
					lastEvent = events[0];
				} else {
					lastEvent = events[events.length-1];
				}

				return $j.methods(title, {
					productCreate: function() {
						return lastEvent[1][0]
					},
					default: function() {
						return lastEvent;
					}
				});

				//$j.designer().getView();
			},	
			product: function() {
				return get.product();
			},
			/*
				views: [
					{
						"title": "Bag 1",
						"thumbnail": "images/products/bags/1/perspective.png",
						"options": null,
						"elements": []
					}
				],
				category: "Bean Bags"

			*/
			addProduct: function() {
				var product =  get.product();
				// var product = z;
				// if(!product) {
				// 	product =  get.product();
				// }

				return designer.addProduct(product.views, product.category)
			}
		});	
	},
	/*
		$j.materials();
		$j.materials("byID");
		$j.materials("byCategory");
		$j.materials("byCategory", "array");
	*/
	materials: function(x, y) {
		var materials = $j.what("materials");
		
		return $j.methods(x, {
			byID: function() {
				return materials.byID;
			},
			byCategory: function() {
				var returnAs = y;
				if(returnAs==="array") {
					var asArray = materials.byCategoryAsArray;
					if(!asArray) {
						asArray = materials.byCategoryAsArray = {};
					
						$j.each(materials.byCategory, function(categoryID, materials) {
							var materialArray = asArray[categoryID] = [];
							$j.each(materials, function(id, material){
								materialArray.push(material);
							})
						})
					}
					return materials.byCategoryAsArray
				}
				return materials.byCategory;
			},
			undefined: function() {
				return materials;
			}
		});
	},
	controls: {
		/*
			TODO: Migrate inspector to build build out > will make some/most of the following unnecesary
		
			$j.controls.inspector("product", {
				labels:{
					1: "Square Bean Bag: Small",
					2: "Furniture"
				}
			});

			$j.controls.inspector("material", 
				[
					{
						id:"uniqueID",
						labels:{
							1: "navigation",
							2: "find your way"
						},
						icons: {
							1:"oneui-check-1",
							2:"oneui-stop-1"
						}
					}
				]
			);

			$j.controls.inspector("sizing");

		*/
		inspector: function(x, y) {
			var $inspector = $j.el("inspector").closest("wrapper#inspector");

			return $j.methods(x, {
				patterns: function() {

				},
				pattern: function() {

				},
				products: function() {
					return $j.el("inspector").find("wrapper#products");
				},
				product: function() {
					var items = y;
					var $products = this.products();

					// TODO: create an $j.el ref for new version of view and views (vs 2d designer)
					$j("views view:first").triggerHandler("view.select")

					var $inspected = $products.find("[inspecting=product]");
					if($inspected.length>0) {
						if($products.find("#"+items[0].id+"[inspecting=product]").length>0) {
							return false;
						}
						
						$inspected.remove();
						 return buildANewProductToInspect();
					}
					return buildANewProductToInspect();
					
					function buildANewProductToInspect() {
						$products.build({
							name:"item",
							data:y,
							after: function(i, o) {
								$j(this).attr({
									attr:"inspecting:type,id:id"
								});

								o.type = "product";
								$j(this)
									.build("populate", o)
									.data("clara", o);
							},
							completed: function() {
								resize();
							}
						});
					}
				},
				materials: function() {
					return $inspector.find("wrapper#materials");
				},
				material: function() {
					var items = y;
					var $materials = this.materials();

					if(this.materials().find("#"+items[0].id).length>0) {
						return false;
					}

					this.materials().build({
						name:"item",
						data:y,
						after: function(i, o) {
							var $icon = $j(this)
								.attr({
									attr:"inspecting:type,id:id"
								})
								.find("wrapper > icon");

							$icon
								.children("div[svg]:first").attr({
									svg:"class:icons.1"
								})
								.next("img").remove();

							$icon.append("<div svg='class:icons.2'></div>");

							o.type = defined(o.type, "material");
							$j(this)
								.build("populate", o)
								.data("clara", o);

							$j(this).siblings("[inspecting="+o.type+"]").remove();
						},
						completed: function() {
							// YUCK
							//$j(this).siblings("#"+$j(this).attr("id")+"[inspecting=material]").remove();
							//$j(this).siblings("[inspecting=design]").remove();
							resize();
						}
					})
				},
				designs: function() {

				},
				design: function() {

				},
				sizing: function() {
					var height = 0;
					var tabsHeight = 40;

					$inspector.find("tabs, item[inspecting]").each(function() {
						height = height+$j(this).outerHeight();
					})
					
					if(height<=tabsHeight) {
						height = 0;
					}
					$inspector.height(height);
					
					return height;
				},
				undefined: function() {

				}
			});


			function resize() {
				$j.controls.inspector("sizing");
			}
			
			function update($el, content) {
				return $el.html(content);
			}
		},
		/*
			$j.controls.tabs("tabsID")
			$j.controls.tabs("selections", "active")
		*/
		tabs: function(tabID, x) {
			var $tabs = $j("tabs#"+tabID);

			return $j.methods(x, {
				active: function() {
					return $tabs.find("tab.active");
				},
				undefined: function() {
					return $tabs;
				}
			})
		}
	},
	/*
		$j.models("fbx.bags", function(selection) {
			// this = ctx
		})

		$j.models("fbx.bags", "children", function(selection) {})
		$j.models("fbx.bags", "children", "last", function(selection) {})
		$j.models("fbx.bags", "children", 3, function(selection) {})

		$j.models("fbx.bags", "type\\.*", function(selection) {})
		$j.models("config.x", "line.beanBag", "type.square", "children", function(selection) {$j.log(selection)})
	
		$j.models("selected")
		$j.models("selectedLogo")
		$j.models("selected", {
			layerID:selector,
			value: e.deltaY/10,
			attribute:"yOffset"
		})

		$j.models("show", model)
	*/
	// originSelector, x, y
	models: function() {
		var params = $j.makeArray(arguments),
			originSelector = params[0];

		// TODO: Restructure entire models function so I dont have to block it's core functionality 
		// which folows this next block
		var clara = $j.what("clara");
		var additionalMethods = $j.methods(params[0], {
			selected: function() {
				if(!params[1]) {
					return clara.selected.model
				}

				var selector = params[1].layerID;
				if(!selector) {
					selector = $j.models("selectedLogo");
				}
				$j.models(selector, function($mod) {
					var o = {};
					o[params[1].attribute] = $mod.get(params[1].attribute)+params[1].value
					$mod.set(o);
				});
			},
			selectedLogo: function() {
				var selectedNode = clara.selected.node;
				if(!selectedNode) {
					return false;
				}

				var selectedLogo = clara.imported.materials.byModel[selectedNode.get("name")].logo;
				if(!selectedLogo) {
					return false;
				}
				var selector = selectedLogo.split("material")[0]+"composite#Image[name=CanvasComposite]";
				return selector;
			},
			show: function() {
				var model = params[1];

				// items and views and products share lots of the same meanings (need to fix)
				//var item = $j.o("item", currentViews[0].title)
				//var	environment = defined(item.environment, "3d");
					var	environment = "3d";

				$j("body").attr("environment", environment);

				var selected = $j.what("clara").selected;
				$j.models("item\\.*#Properties", function(o) {
					o.set({visible:false});

					$j.models(model.typeID, model.layerID+"#Properties", function(prop) {
						if(!prop) {
							return false;
						}
						selected.model = {};
						prop.each(function(mod) {
							var name = mod.node().parentNode().get("name");
							if(name==model.typeID) {
								mod.set({visible:true});
								// var selectedModel = selected.model = {
								// 	family:model.family,
								// 	title: model.title,
								// 	line:model.line.layerID,
								// 	type:model.typeID,
								// 	layers: {
								// 		inOrder:item.layers
								// 	},
								// 	target:name,
								// 	node: mod
								// }
								// $j.each(item.layers, function(i, layerName) {
								// 	// Each layer is keyed by it's name with a value equally the primary selector (first array item)
								// 	selectedModel.layers[layerName] = item.layers[0];
								// });
							}
						});

						//$j.el("views", 1).trigger("click");
					});
				})

			},
			hide: function() {
				var model = params[1];
		

			}
		});
		if(additionalMethods) {
			return additionalMethods;
		}


		var selection;

		return $j.clara("find", originSelector, function(selection) {
			var claraContext = this; // > ctx
		
			// iterate through arguments until reach a function
			$j.each(params.slice(1), function(i, argument) {
				$j.overload(argument, {
					"string": function() {
						/*
							1. modify selection(filter) with new selection
							2. continue iterating
						*/
						selection = $j.methods(argument, {
							// all decendants
							"*": function() {
								return selection.children({
									shallow:false
								});
							},
							// only direct decendants (one level down)
							children: function() {
								/* 
									TODO: Improve so selection respects hierarcy .. prob a better way than looping
									o.each(function(mod) {
										if(mod.parentNode().get("name")==item.typeID) {
										
										}
									})
								*/
								return selection.children({
									shallow:true
								});
							},
							// first descendant
							first: function() {
								return selection.first();
							},
							// last descendant
							last: function() {
								return selection.first();
							},
							// decendants matching selector
							default: function() {
								return selection.findSelector(argument);
							}
						});
					},
					// descendant matching index number (instead of at(idx))
					"number": function() {
						selection = selection.at(argument);
					},
					"function": function() {
						var callback = argument;

						// no more selectors, return final selection to callback
						return callback.apply(claraContext, [selection])
					}
				});
			});
		});
	},
	/*
		$j.camera("move", "side_left.beanBag");
	*/
	camera: function(method, x) {
		$j.methods(method, {
			move:function() {
				var viewID = x;
				$j.models("cameras", viewID+"#Transform[name=Transform]", function(o) {	
					var coords = {
						rotation:o.get("rotation"),
						translation:o.get("translation")
					}
					change.position(coords);				
				});
			}
		})
		
	},
	/*
		$j.layer();
		$j.layer("familes")

		$j.layer("family", "furniture")

		TODO: build dynamically
	*/
	layer: function(type, name) {
		var products = $j.what("products");
		if(!products){ 
			return getLayers(function(type) {
				return getLayer(type);
			})
		}

		return $j.methods(type, {
			family: function() {
				return products["family."+name];
			},
			families:function() {
				return {
					furniture:products["family.furniture"]
				}
			},
			lines: function() {
				return {
					beanBag:products["family.furniture"]["line.beanBags"]
				}
			},
			types: function() {
				return {
					round:products["family.furniture"]["line.beanBags"]["type.round"],
					square: products["family.furniture"]["line.beanBags"]["type.square"]
				}
			},
			items: function() {
				return [products["family.furniture"]["line.beanBags"]["type.round"], products["family.furniture"]["line.beanBags"]["type.square"]];
			},
			default: function() {
				return products;
			}
		});
	},
	/*
		$j.clara("find", "fbx.bags", function(o) {})
		
		$j.clara("assignMaterial", {
			sceneID: "68bf1a54-f472-4354-86c4-5d4340c2248d", or "materials.1"
			material:"fabric_1",
			assignTo:"item.S.base"
		}, function(a, b) {
			// this > CTX
			$j.log(arguments)
		})

		$j.clara("uuid", "Model") > 68bf1a54-f472-4354-86c4-5d4340c2248d
		$j.clara("uuid", "Material")
		$j.clara("uuid", "Logo")

		$j.clara("sceneName", "Model") > bags.10
		$j.clara("sceneName", "Material")
		$j.clara("sceneName", "Logo")
	*/
	clara: function(method, selector, callback) {
		var clara = $j.what("clara");

		if(method=="uuid") {
			/*
				"activeModel":"bags.10",
				"activeMaterial":"materials.2",
				"activeLogo":"logos.2"
			*/	
			return clara.models[clara["active"+selector]];
		}
		if(method=="sceneName") {
			return clara["active"+selector];
		}

		// if(!method) {
		// 	return $j.what("clara");
		// }
		var scripts = {
			show: function(ctx) {
				return ctx(selector).set({
					"visible":true
				});
			},
			hide: function(ctx) {
				return ctx(selector).set({
					"visible":false
				});
			},
			find: function(ctx) {
				return ctx(selector);
			},
			assignMaterial: function(ctx) {
				var clara = $j.what("clara");

				var sceneID = selector.sceneID;
				if(!sceneID) {
					sceneID = clara.models[selector.sceneName];
				}
				if(!sceneID) {
					return false;
				}

				// clara.events.importing[sceneID] = {
				// 	selector: selector
				// }

				var importedMaterials = clara.imported.materials,
					byModel = importedMaterials.byModel,
					model = byModel[selector.assignTo];
				if(!model) {
					model = byModel[selector.assignTo] = {};
				}

				var material = model[selector.type]
				if(material) {
					if(material==selector.material) {
						$j.log("already assigned")
						// selector.$item.trigger({
						// 		type:"loaded.material",
						// 		o: {
						// 			clara:ctx,
						// 			selectors:selector
						// 		}
						// 	});
					}

					if(importedMaterials.byMaterial[selector.material]===true) {
						 $j.models(selector.assignTo+"#Material[name=Reference]", function(ctx) {
							ctx.set({reference: selector.material})
							model[selector.type] = selector.material

							selector.$item.trigger({
								type:"loaded.material",
								o: {
									clara:ctx,
									selectors:selector
								}
							});
					
						})
					} else {
						return importMaterial(ctx, sceneID, selector, model, importedMaterials);
					}
				} else {
					return importMaterial(ctx, sceneID, selector, model, importedMaterials);
				}

				// EVENTS are binding each time, dont grasp how the scene eventing works
				// temp solved with > data.clara._events.loaded = data.clara._events.loaded.slice(1);
				function importMaterial(ctx, sceneID, selector, model, importedMaterials) {
					$j.el("model3d").clara("assignMaterial", {
						importSceneId: sceneID,
						material: selector.material,
						assignTo: selector.assignTo
					}).then(function(o) {
						model[selector.type] = selector.material
						importedMaterials.byMaterial[selector.material] = true;
					})

					ctx.scene.whenLoaded(function() {
						selector.$item.trigger("loading.material")
					});

					ctx.scene.on("loaded", function() {
						selector.$item.trigger({
							type:"loaded.material",
							o: {
								clara:this,
								selectors:selector
							}
						});
					});
					// TODO: EVENTS should be moved to actors.js to prevent double binding
					//var eventInit = $j.what("clara").events.materialLoaded;
					//if(!eventInit) {
						//$j.what("clara").events.materialLoaded = true;
/*
						
								
						ctx.scene.on("loaded", function() {
							selector.$item.trigger({
								type:"loaded.material",
								o: {
									clara:this,
									selectors:selector
								}
							});
						});
					*/
					//}
				}
			}
		}

		$j.el("model3d").clara("script", {
			fn: function(ctx) {
				var result = [scripts[method].apply(this, arguments)]

				if(callback) {
					return callback.apply(ctx, result);
				}
			}
		});
	},
	/*
		$j.o("line")
		$j.o("line", "bean bags")
		$j.o("line", "bean bags", "environment")

		$j.o("item")
		$j.o("item", "Square: Medium")
		$j.o("item", "Square: Medium", "environment")

		$j.o("view", "Square: Medium")
		$j.o("view", "Square: Medium", "middle1")
		$j.o("view", "Square: Medium", "bottom")
	*/
	o: function(x,y,z) {
		var data = $j.what("o");

		return $j.methods(x, {
			line: function() {
				var o = data.byProductLine;
				if(!y) {
					return o;
				}
				if(!z) {
					return defined(o[y]);
				}
	
				if(o[y]) {
					return defined(o[y][z], false);
				} 
				return false;
			},
			item: function() {
				var o = data.byItem;
				if(!y) {
					return o;
				}
				if(!z) {
					return defined(o[y], false);
				}
				if(o[y]) {
					return defined(o[y][z], false);
				}
				return false;
			},
			view: function() {
				var itemTitle = y;
				var viewTitle = z;

				var byItem = data.byItem;
				// if(!byItem) {
				// 	return data;
				// }
				if(!itemTitle) {
					return false;
				}

				var byView = byItem[itemTitle];
				if(!byView) {
					return false;
				}
				if(!viewTitle) {
					return byView;
				}
				var view = byView[viewTitle]
				if(!view) {
					return byView;
				}
				return view;
			}
		});

		// function get(key, o) {
		// 	return $j.methods(key, {
		// 		undefined: function() {
		// 			return false;
		// 		},
		// 		environment: function() {
		// 			return products["family."+name];
		// 		}
		// 	});
		// }
	},
	/*
		$j.throttle("click", event, 400, callback)

		TODOs:
			1. Migrate to $j core as a dom extension so context may be passed
			2. Improve logic (pretty bad)
			3. Extend actors.events.js to accomadate some event settings like:
				a. if events within should be throttled 
				b. throttle timeout/setting config (vs passing)
			4. Come up with way to reduce parameters needed using unique jqueryID and config
	*/
	throttle: function(id, event, timeout, callback) {
		var timeStamp = $j.now();
		if(event && event.timeStamp) {
			timeStamp = event.timeStamp;
		}
		
		var times = $j.what("times");
		if(!times[id]) {
			$j.what("times")[id] = timeStamp;
			if(callback) {
				callback.apply($j(event.currentTarget), arguments)
			}
			return true;
		}

		if((timeStamp-times[id])<=timeout) {
			times[id] = timeStamp;

			return false;
		}

		times[id] = timeStamp;
		if(callback) {
			callback.apply($j(event.currentTarget), arguments)
		}

		return true;

		function logTime(id, timeStamp) {
			$j.what("times")[id] = timeStamp;
		}
	}
});



Array.prototype.randsplice = function(){
	var ri = Math.floor(Math.random() * this.length);
	var rs = this.splice(ri, 1);
	return rs;
}
Array.prototype.randval = function(){
	var ri = Math.floor(Math.random() * this.length);
	var val = this[ri];
	return val;
}
