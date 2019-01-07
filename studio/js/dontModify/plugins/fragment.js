(function($) {
	var plugin = {
		name:"fragment",
		methods: {},
		fragments: {},
		init:false,
		requests:{},
		data: {
			loaded:{
				events:false
			},
			cached: []
		},
		paths: {
			fragments:"fragments/"
		},
		types: {
			html: ".html"
		},
		callbacks: {

		}
	};

	/*
		TODOs:
			1. Work with local fragments versus just remote
				- replace name with a selector/jquery object
			2. Implement some type of basic action/eventing system
			3. Implement a data object on clone fragments to access simple constrction concepts
				- $(clonedFragment).fragment("buildAnother", 5) > ("buildAnother", [{ ... }, {... }])
				- $(clonedFragments).fragment("rebuild", [{ ... }, {... }])
			4. Consider implementing light handlebars/mustace templating
			5. Add a rule to the iteration (after callback function) to allow a dataset to be specified without an after function
				- function that returns either true or false on each iteration of the data array
			6. Add automated selector creation $.sel()
	*/
	plugin.methods.dom = {
		/*
			jQuery("body").fragment({
				name:"build"
			});

			jQuery("body").fragment({
				name:"build",
				data: 10
			});

			jQuery("body").fragment({
				name:"build",
				data: [
						{
							name:"product ONE",
							id:1
						},
						{
							name: "product TWO",
							id:2
						}
				],
				after: function() {

				},
				completed: function() {

				}
			});
		*/
		init: function(o) {
			var el = jQuery(this);
			overload(o, {
				"undefined": function() {
					plugin.init = true;
					jQuery("body").plugins(plugin.name, plugin);
				},
				"object": function(o) {
					var data = overload(o.data, {
						/* Creates n quantity of fragments if number is passed in data */
						number: function() {
							return new Array (o.data);
						},
						undefined: function() {
							return new Array(1);
						},
						default: function() {
							return o.data;
						}
					});

					// TODO: Restructure how parameters & callbacks are passed
					return el.fragment("build",
						o,
						data,
						o.after
					);
				}
			});

			return el;
		},
		/*
			jQuery("body").fragment("build",
				"product",
				[
					{
						name:"product ONE",
						id:1
					},
					{
						name: "product TWO",
						id:2
					}
				],
				function(o) {
					jQuery(this)attr({
						id:o.id
					});
				}
			);
		*/
		build: function(obj, a, callback, meta) {
			var name = obj.name;
			var $parent = jQuery(this);

			var requests = plugin.requests[name];
			if(!requests) {
				requests = plugin.requests[name] = [];
			};

			var request= {
				$parent: $parent,
				arguments:arguments
			};
			if(!meta) {
				requests.push(request);
			};

			// If a new request for a remote fragment is recieved before an earlier request is completed > wait
			if(requests.length>1) {
				return false;
			}

			//  After a fragment has been successfully loaded (from remote), future requests wont require the delay (async)
			return jQuery.fragment("load", name, function(o) {
				// TODO: Address the consistency of the object being passed around
				var name = o.name.name,
					passedObj = o.name;

				var $fragment = jQuery(this);
				var requests = plugin.requests[name];

				jQuery.each(o.data, function(i) {
					var $frag = $fragment.clone().appendTo(o.$parent);

					if(callback) {
						o.callback.apply($frag, [i, this]);
					}

					if(i>=o.data.length-1 && passedObj.completed) {
						passedObj.completed.apply($frag, [o, o.data]);
					}
				});

				// if more requests for this fragment exist
				if(requests.remove(0)>0) {
					var args = requests[0].arguments;
					requests[0].$parent.fragment("build",
						args[0],
						args[1],
						args[2],
						{deferred:true}
					);
				};

				return $fragment;
			}, requests[0]);
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
				<div svg="class:icon"></div> 
					BECOMES (original el with SVG attr is replaced)
				<svg class="arrow-38"><use xlink:href="#arrow-38"></use></svg>

			AUDITING Concepts:
				$j(this).fragment("populate", "audit");
				<element populated> ... </element>


			Current scans for the following attrs:
				1. content
				2. media
				3. attr


			//TODO: improve method of auditing unpopulated fragments (would be ideal to remove at the beginning)
			jQuery("product").fragment("populate", "audit");
		*/
		populate: function(o) {
			if(jQuery.type(o)=="audit") {
				var populated = $j(this).find("[populated]");
				return populated
					.not(":visible").remove()
					//$j(this).find("[populated]").not("[populated=true]").remove();
					//.add(populated.filter(":not([populated=true])")).remove();
			}

			jQuery(this)
				.find("[content], [media], [attr], [svg]").addBack("[content], [media], [attr]")
				.each(function() {
					// TODO: TIme to abstract. Should be more method based so new extensions can be added (internally and externally)
					var el = jQuery(this),
						auditEl = el.closest("[populated]");//.data("fragment", o);

					if(jQuery(this).is("[content]")) {
						var splitContent = el.attr("content").split("&"),
							content = applyMap(auditEl,splitContent[0], o);
						el.html(content);
						// Allows for more recursive population > content="alert.action.message&populate"
						// TODO: decide whether it's worth having to dictate when to recurrsively populate vs. automatically
						if(splitContent.length>1) {
							el.children().fragment("populate", o);
						}
					}

					if(el.is("[svg]")) {
						var svgAttrs =el.attr("svg").split(":");
						var svgAttr = applyMap(auditEl, svgAttrs[1], o);
						el.replaceWith("<svg class='"+svgAttr+"'><use xlink:href='#"+svgAttr+"'></use></svg>");
					}

					if(el.is("[media]")) {
						var attr =el.attr("media").split(":");
						el.css(attr[0], applyMap(auditEl, attr[1], o));
					}

					function applyAttr(str) {
						// if(!str) {
						// 	str =attr;
						// }
						str = str.split(":");

						// attr="class:alert.icon"
						if(str.length>1) {
							var value = applyMap(auditEl, str[1]);

							var methods = {
								"class":function() {
									el.addClass(value);
								},
								def: function() {
									el.attr(str[0], value);
								}
							};
							var method = methods[str[0]];
							if(!method) {
								method = methods.def;
							}
							 return method();
						}
					}
					
					// TODO: as ATTR is built out, consider rooting most of populate's logic within
					if(el.is("[attr]")) {
						var attr = el.attr("attr"),
							attrs =attr.split(",");
						// attr="state:state&&position:raised"
						if(attrs.length>1) {
							$j.each(attrs, function() {
								applyAttr(this.toString());
							});
						} else {
							applyAttr(attr);
						}

						


						// attr="alert.type"
						return el.attr("attr", applyMap(auditEl, el.attr("attr"), o));
					}
				});

			return jQuery(this);

			function applyMap(auditEl, map) {
				var refObj = o;

				var value;
				var splitMap = map.split("||");
				if(splitMap.length>1) {
					$j.each(splitMap, function() {
						value = jQuery.mapTo(this.toString(), refObj);
						if(value) {
							return false;
						}
					});
				} else {
					value = jQuery.mapTo(map, refObj);
				};

				// If the parent element has not been populated
				if(!auditEl.is("[populated=true]")){
					// and a child elemtent has a legitamate value to be populated with
					if(value) {
						// indicate to the DOM that the parent contains populated values (helps with auditing/visibility of excess entities)
						auditEl.attr("populated", true)
					}
				}

				return value;
			}
		}
	};

	/*
		Internal actions are the same of external except for the context passed to an
		internal callback is the actual fragment versus the external callbacks which
		receive a clone

		product: {
			dom:jQuery(< ..... />),
			actions: {
				before: function() {

				},
				after: function() {

				}
			}

		TODO:
			1. Improve passed parameters to build (making more oo) but also the ability
				to specify other actions besides after
			2. Based on how #1 is handled, move the setup of these actions to another place
	*/
	plugin.fragments = {
		def: {
			actions: {
				before: function() {

				},
				after: function() {

				}
			}
		}
	}

	plugin.methods.events = function(context) {
		//plugin.data.loaded.events = true;
	};

	var util = plugin.methods.util = {
		init: function(x) {

		},
		/*
			jQuery.fragment("load", "product");

			jQuery.fragment("load", "product", function() {
				jQuery.log("CALLBACK", jQuery(this))
			}, { request });
		*/
		load: function(name, callback, request) {
			if(!plugin.init) {
				jQuery("body")[plugin.name]();
			}

			var fragment = plugin.fragments[name];
			if(!fragment) {
				fragment = plugin.fragments.def;
			};

			// if a fragment already exists (TODO: add the ability to force refresh)
			if(fragment.dom) {
				var dom = fragment.dom.children().clone();//.children();

				// TODO: add a local after function that handles the various returns (sync & async)
				if(callback) {
					var args = request.arguments;
					callback.apply(dom, [{
						$parent:request.$parent,
						name:args[0],
						data:args[1],
						callback:args[2]
					}]);
				};

				// return a clone of the clone
				return dom;
			};

			var actions = fragment.actions;

			var $fragment = jQuery.fragment("create", name);
			actions.before.apply($fragment);
			var src = plugin.paths.fragments+name+plugin.types.html;
			$fragment.load(src, function() {
				$j("head").find("script:first").before(jQuery(this).children("style").attr({
					id: name,
					relation:"fragment",
					src:src,
					type:"text/css"
				}));

				// on the internal fragment action can modify the original frament
				actions.after.apply(jQuery(this).children());

				// callback only get access to the clone
				if(callback) {
					var args = request.arguments;
					// TODO: refactor request / deferred object thats passed around (too much translation between methods)
					callback.apply(jQuery(this).children().clone(), [{
						$parent:request.$parent,
						name:args[0],
						data:args[1],
						callback:args[2]
					}]);
				}
			});

			return $fragment.children().clone();
		},
		/*
			jQuery.fragment("create", "product");
		*/
		create: function(name) {
			var fragment = plugin.fragments[name];
			if(!fragment) {
				fragment = plugin.fragments[name] = {};
			}
			//fragment.dom = jQuery("<fragment />");
			fragment = jQuery.extend(true,
				fragment,
				{
					dom: jQuery("<fragment />"),
					actions: {
						before: function() {

						},
						after: function() {

						}
					}
				}
			);

			return fragment.dom;
		},
		/*
			jQuery.fragment("cache", ["b1", "b2", "b3"], function(fragments) {
				$j.log("all done loading " + fragments)
			});
		*/
		cache: function(fragments, callback) {
			if(!fragments || fragments.length<1) {
				return false;
			}
			overload(fragments, {
				"string": function() {
					fragments = [fragments];
				},
				"array": function() {
					fragments = fragments;
				}
			});

			if(!plugin.cache) {
				plugin.cache = add(1, "div", "body", "fragCache");
			}

			plugin.cache.fragment({
				name:fragments[0],
				completed: function() {
					plugin.data.cached.push(fragments[0]);

					if(fragments.remove(0)<1){
						plugin.cache.remove();
						delete plugin.cache;

						var cachedFrags = plugin.data.cached;
						plugin.data.cached = [];

						return callback.apply(this, [cachedFrags]);
					}

					return jQuery.fragment("cache", fragments, callback);						
				}
			});
		}
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(a){var b=plugin.methods.dom;if(b[a]){return b[a].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof a==="object"||!a){return b.init.apply(this,arguments)}else{jQuery.error("Method "+a+" does not exist on jQuery(el)."+plugin.name)}};jQuery[plugin.name]=function(a){if(jQuery.isNumeric(a)){a=parseInt(a)}var b=plugin.methods.util;if(b[a]){return b[a].apply(b,Array.prototype.slice.call(arguments,1))}else if(typeof a==="object"||!a||plugin.data[a]||jQuery.isNumeric(a)){return b.init.apply(b,arguments)}else{jQuery.error("Method "+a+" does not exist on jQuery."+plugin.name)}}
})(jQuery);
