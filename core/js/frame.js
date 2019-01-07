/*
	theFrame Core > frame.js

	coming soon:
	$(window).load
*/
function initialize() {
	window.e = {};
	window.p = {};

	jQuery("body")
		.data("browser", navigator.appName)
		.data("plugins", {})
		.data("cache", {})
		.data("times", {});

	jQuery.extend({
		/*
				var obj = {
					x: {
						y: {
								z:1
						}
				}
			}

			jQuery.mapTo("x.y.z", obj) > returns 1;
		 */
		mapTo:function(map, obj) {
			return overload(map, {
				"array": function() {
					return map[0];
				},
				"string": function() {
					jQuery.each(map.split(/\.|:/), function() {
						if(obj) {
							obj = obj[this];
						}
					});
					return obj;
				}
			});
		},
		/*
			TRANSFORM
			1. 	Maps an object or set of objects into an array of objects.
				New objects are restructured according to passed map.

					var obj = {
						section: "content",
						extendedProfile: {
							label: "item size",
							attr: {
								id: 15
							},
							required: true,
							show: false
						}
					};
					var mappingObj = {
						id: "extendedProfile.attr.id",
						label: "extendedProfile.label",
						required:"extendedProfile.required"
					}
					jQuery.transform(obj, mappingObj);

					RETURNS:
						[
							{
								id:15,
								label:"item size",
								required:true
							}
						]

			2. 	A third "rule" function may be optionally passed as a third parameter.
				Rules returning true will be added to transformed array of objects.

					jQuery.transform(obj, mappingObj, function() {
						if(this.extendedProfile.required || this.extendedProfile.show) {
							return true;
						}
						return false;
					});
		*/
		transform: function(o, map, rule) {
			var a = [];
			jQuery.each(o, function(key, thisObj) {
				var newObj = {};
				jQuery.each(map, function(mappedKey) {
					var value = jQuery.mapTo(this, thisObj);
					overload(rule, {
						"undefined": function() {
							newObj[mappedKey] = value;
						},
						"function": function() {
							if(rule.apply(thisObj)) {
								newObj[mappedKey] = value;
							}
						}
					});
				});
				if(!jQuery.isEmptyObject(newObj)) {
					a.push(newObj);
				};
			});
			return a;
		},
		log: Log4js.info,
		wRoot: function(what) {
			if(what != undefined) {
				jQuery("body").data("wRoot", "../" + jQuery("body").data("site") + "/widgets/" + what + "/");
			}
			return jQuery("body").data("wRoot");
		},
		api: function(what) {
			return jQuery.noSpaces((jQuery.what("api").redeem + defined(what, "")));
		},
		what: function(a, b, c) {
			if(a) {
				if(jQuery.type(a) == "boolean") {
					if(b) {
						if(c != undefined) {
							//jQuery.what(true, "something", {})
							jQuery.localStorage.set(b, c);
						}
						//jQuery.what(true, "something")
						return jQuery.localStorage.get(b);
					}
					//jQuery.what(true) > returns everything stored in localStorage
					return jQuery.localStorage.storageObj();
				}

				if(b != undefined) {
					//jQuery.what("something, {})
					jQuery("body").data(a, b);
				}
				//jQuery.what("something")
				return jQuery("body").data(a);
			}
			//jQuery.what() > returns everything stored on jQuery("body")
			return jQuery("body").data();
		},
		domain: function() {
			var hostname = location.hostname.split(".");
			location.subdomain = hostname[0];

			var environment = location.hostname[1];
			if(hostname[1] == jQuery("body").data("site")) {
				location.environment = "prod"
			} else {
				location.environment = hostname[1]
			}
			location.site = hostname[hostname.length - 2];
		},
		/*
			$j.url.decode()
		*/
		url: {
			decode: function() {
				if(location.search.length<1) {
					return {};
				};

				return JSON.parse('{"' + decodeURI(location.search.substr(1).replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
			}
		},
		// TODO: move to tools jQuery.tools() > consider other random  functions
		// noPrefix would be used if someone didnt' want the returned random string to be prefixed with "digit"
		// random: function(length, noPrefix) {
		// 	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
		// 		string_length = defined(length, 12) - 5,
		// 		randomstring = '';
		// 	for(var i = 0; i < string_length; i++) {
		// 		var rnum = Math.floor(Math.random() * chars.length);
		// 		randomstring += chars.substring(rnum, rnum + 1);
		// 	}
		// 	return "DIGIT" + randomstring;
		// },
		random: function(length) {
			length = defined(length, 8);
			var timestamp = +new Date;

			function getRandomInt( min, max ) {
				return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
			}

			var ts = timestamp.toString(),
				parts = ts.split( "" ).reverse(),
				id = "";

			for( var i = 0; i < length; ++i ) {
				var index = getRandomInt( 0, parts.length - 1 );
				id += parts[index];	 
			}

			return id;
		},
		math: {
			/*
				jQuery.math.random("normal", mean, deviation)
			*/
			random: function(method, x1, x2) {

				var methods = {
					/*
						Returns a function for generating random numbers with a normal (Gaussian) distribution. The expected value of the generated pseudorandom numbers is mean, with the given standard deviation. If deviation is not specified, it defaults to 1.0; if mean is not specified, it defaults to 0.0.

						random.normal([mean, [deviation]])
							.normal(max/2, stddev)
					*/
					normal: function(µ, σ) {
						var n = arguments.length;
						if (n < 2)σ = 1;
						if (n < 1)µ = 0;
						return function() {
							var x, y, r;
							do {
								x = Math.random() * 2 - 1;
								y = Math.random() * 2 - 1;
								r = x * x + y * y;
							} while (!r || r > 1);
							return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
						};
					},
					/*
						Returns a function for generating random numbers with a log-normal distribution. The expected value of the random variable’s natural logrithm is mean, with the given standard deviation. If deviation is not specified, it defaults to 1.0; if mean is not specified, it defaults to 0.0.

						random.logNormal([mean, [deviation]])
					*/
					logNormal: function() {
						var random = d3.random.normal.apply(d3, arguments);
						return function() {
							return Math.exp(random());
						};
					},
					/*
						Returns a function for generating random numbers with an Irwin–Hall distribution. The number of independent variables is specified by count.

						random.irwinHall(count)
					*/
					irwinHall: function(m) {
						return function() {
							for (var s = 0, j = 0; j < m; j++) s += Math.random();
							return s / m;
						};
					}
				};

				methods[method].apply(methods, [x1,x2]);
			}
		},
		/*
			$j.to.array(o, "name")
		*/
		to:{
			array: function(o, keyAs) {
				// const toArrayWithKey = (obj, keyAs) =>
				return  _.values(_.mapValues(o, (value, key) => { value[keyAs] = key; return value; }));
		
			}
		},
		/*
			$j.findKey(obj, "key");

			TODO: Reconsider naming if used more, since we are really getting KEY- Values
			By default return the value of found key(s)
		*/
		findKey: function(x, s) {
			var results = find(x, s);
			if(results.length>1) {
				return results;
			} 
			return results[0];

			function find(o, key) {
				if (_.has(o, key)) {
					return [o];
				}

				// 1. Efficiency
				var results = [];
				_.forEach(o, function(val) {
					if (typeof val == "object" && (val = find(val, key)).length) {
						var result = val[0][key];
						if(result) {
							results.push.apply(results, [result]);		//.apply(results, val);
						}
					}
				});

				// 2. Elegance
				// return _.flatten(_.map(o, function(v) {
				// 	return typeof val == "object" ? find(val, key) : [];
				// }), true);
				return results;
			}
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
		},
		/*
			 jQuery.plugin();

			 jQuery.plugin("effects");

			jQuery.plugin("effects", {
				expose: {
					instances: {}
				}
			});


			General utility to init plugin's global and specific data
			** MAY expand to hand more centralized data concepts to body
		*/
		plugin: function(name, initObj) {
			var plugins = jQuery("body").data("plugins");

			if(!plugins) {
				jQuery("body").data("plugins", {});
				plugins = jQuery("body").data("plugins");
			}

			if(!name) {
				return plugins;
			}

			if(!plugins[name]) {
				plugins[name] = defined(initObj, {});
			}

			return plugins[name];
		},
		/*
			$j.methods("methodTwo", {
				methodOne: function() {

				},
				methodTwo: function() {
					$j.log("This method will be called with the $j('body') as the context")
				},
				methodThree: function() {

				},
				// def or default > migrating to def but want to maintain backwards compat
				def: function() {
					$j.log("This is the default method that will be called if the method specified doesn't exists in functions")
				}
			}, $j("body"));
		*/
		methods: function(x, functions, context) {
			var thisFunction = functions[x];
			if(!thisFunction&&functions.def) {
				thisFunction = functions.def;
			}
			if(!thisFunction&&functions.default) {
				thisFunction = functions.default;
			}
			if(!thisFunction) {
				return false;
			}
			return thisFunction.apply(defined(context, functions), arguments);
		},
		overload: overload,
		/*
			$j.diff.map({
				a: 'i am unchanged',
				b: 'i am deleted',
				e: {
					a: 1,
					b: false,
					c: null
				},
				f: [1, {
					a: 'same',
					b: [{
						a: 'same'
					}, {
						d: 'delete'
					}]
				}],
				g: new Date('2017.11.25')
			}, {
				a: 'i am unchanged',
				c: 'i am created',
				e: {
					a: '1',
					b: '',
					d: 'created'
				},
				f: [{
					a: 'same',
					b: [{
						a: 'same'
					}, {
						c: 'create'
					}]
				}, 1],
				g: new Date('2017.11.25')
			});

			TODO: Migrate $j.diff to overload/method concepts
		 */
		diff: function() {
			return {
				VALUE_CREATED: 'created',
				VALUE_UPDATED: 'updated',
				VALUE_DELETED: 'deleted',
				VALUE_UNCHANGED: 'unchanged',
				map: function(obj1, obj2) {
					if (this.isFunction(obj1) || this.isFunction(obj2)) {
						throw 'Invalid argument. Function given, object expected.';
					}
					if (this.isValue(obj1) || this.isValue(obj2)) {
						return {
							type: this.compareValues(obj1, obj2),
							data: (obj1 === undefined) ? obj2 : obj1
						};
					}

					var diff = {};
					for (var key in obj1) {
						if (this.isFunction(obj1[key])) {
							continue;
						}

						var value2 = undefined;
						if ('undefined' != typeof(obj2[key])) {
							value2 = obj2[key];
						}

						diff[key] = this.map(obj1[key], value2);
					}
					for (var key in obj2) {
						if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
							continue;
						}

						diff[key] = this.map(undefined, obj2[key]);
					}

					return diff;

				},
				compareValues: function(value1, value2) {
					if (value1 === value2) {
						return this.VALUE_UNCHANGED;
					}
					if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
						return this.VALUE_UNCHANGED;
					}
					if ('undefined' == typeof(value1)) {
						return this.VALUE_CREATED;
					}
					if ('undefined' == typeof(value2)) {
						return this.VALUE_DELETED;
					}

					return this.VALUE_UPDATED;
				},
				isFunction: function(obj) {
					return {}.toString.apply(obj) === '[object Function]';
				},
				isArray: function(obj) {
					return {}.toString.apply(obj) === '[object Array]';
				},
				isObject: function(obj) {
					return {}.toString.apply(obj) === '[object Object]';
				},
				isDate: function(obj) {
					return {}.toString.apply(obj) === '[object Date]';
				},
				isValue: function(obj) {
					return !this.isObject(obj) && !this.isArray(obj);
				}
			}
		}()
	});

	/*
		DOM implementation of $j.methods
			* Chained context becomes context for method functions passed
			TODO: Evalulate what should be returned


		$j("div:first").methods("methodTwo", {
			methodOne: function() {

			},
			methodTwo: function() {
				$j.log("This method will be called with the $j('div:first') as the context", $j(this))
			},
			methodThree: function() {

			}
		});
	*/
	jQuery.fn.methods = function(x, functions) {
		if($j(this).length<1) {
			return $j();
		}
		return $j.methods(x, functions, $j(this));
	};

	jQuery.fn.klass = function(index, str) {
		if(index == "?") {
			return "help";
		}
		// consider passing in ? for help
		if(jQuery.type(index) == "number") {
			// returns the value at whatever index (adjusted > 1 returns [0]) is passed of the attr class string.
			// If str is passed as second parameter, the return is appended with that value (optional)
			// Example:
			// HTML: <h5 id="exampleH5" class='one two three'></h5>
			// JS: jQuery("#exampleH5").klass(2, "."); > returns .two
			// JS: jQuery("#exampleH5").klass(1); > returns one
			// could improve to support negative index (return items from end)
			if(index <= 0) {
				index = 1;
			}
			return defined(str, "") + this.attr("class").split(" ")[index - 1];
		} else if(index == "swap") {
			return jQuery(this).addClass(str).siblings("." + str).removeClass(str).end();
		}
	};

	/*
		 jQuery(el).plugins();

		 jQuery(el).plugins("effects");

		jQuery(el).plugins("effects", {
			expose: {
				instances: {}
			}
		});
	*/
	jQuery.fn.plugins = function(pluginName, initObj) {
		var el = jQuery(this);
		var plugins =el.data("plugins");

		if(!plugins) {
			el.data("plugins", {});
			plugins = el.data("plugins");
		}

		if(!pluginName) {
			return plugins;
		}

		if(!plugins[pluginName]) {
			plugins[pluginName] = defined(initObj, {});
		}

		return plugins[pluginName];
	};
}

function guidGenerator() {
	var S4 = function() {
			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
	return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function duplicates(arr) {
	var i, len = arr.length,
		out = [],
		obj = {};

	for(i = 0; i < len; i++) {
		obj[arr[i]] = 0;
	}
	for(i in obj) {
		out.push(i);
	}
	return out;
}

// Find strings between parameters "a" and "b"
function between(theString, a, b) {
	return theString.substring(theString.lastIndexOf(a, theString.length - 2) + 2, theString.lastIndexOf(b));
}

function getParameters(what) {
	var parameters = {};
	jQuery.each(what.parameters, function(i) {
		parameters[i] = testJS(this.toString());
	});
	return parameters;
}

function testJS(what, o) {
	try {
		return eval(what);
	} catch(e) {
		return what;
	}
}

// Retruns what if it is defined other returns 2nd parameter if not defined
// Consider adding isFinite() to number type > NaN, infinity (POSITIVE_INFINITY, NEGATIVE_INFINITY)
function defined(what, ifNot) {
	// if(!what) {
	// 	return ifNot;
	// }
	if (typeof ifNot === "undefined") ifNot = false;
	if (typeof what !== "undefined") {
		if (what) {
			if (jQuery.type(what) == "string") {
				try {
					return jQuery.parseJSON(what);
				} catch (e) {
					return what;
				}
			}
			return what;
		}
		if(what===false) return ifNot;
		if (what == 0) return 0;
	}
	return ifNot;
}

// Defined and isEmpty could be consolidated


function isEmpty(what, ifNot) {
	if(what.val().length > 0) {
		if(jQuery.type(what) == "string") {
			return what.val();
		}
	} else {
		return ifNot;
	}
}

/*
	Remove the second item from the array
		array.remove(1);
	Remove the second-to-last item from the array
		array.remove(-2);
	Remove the second and third items from the array
		array.remove(1,2);
	Remove the last and second-to-last items from the array
		array.remove(-2,-1);
*/
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/*
	Creates a slice of array with n elements taken from the end.
	** lodash uses takeLeft for the same functionality

	array.fromEnd(2)
*/
Array.prototype.fromEnd = function(n) {
	return this.slice(Math.max(this.length - defined(n, 1), 0));
}

String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
}

/*
	// Return a random number, 10 digits long
	random({
		length:10
	});

	// Returns a random number between 0 and 10
	random(10);

	// Returns a random number between 10 and 20
	random([10, 20])

	// Returns an array of 20 random numbers between 0 and 10
	random(10, 20)

	TODO: refactor into number utility
*/
function random(n, quantity) {
	return overload(n, {
		"object": function() {
			// alernative approach > Math.floor(100000000 + Math.random() * 900000000);
			var randomNumber = Math.random().toString().substring(2);
			if (n.length<randomNumber.length) {
				return randomNumber.slice(0, n.length);
			}
		},
		"number": function() {
			if(quantity) {
				var randomSet = [];
				for(var i = 0; i < (quantity); i++) {
					randomSet.push(random(n))
				};
				return randomSet;
			} else {
				return(Math.floor(Math.random() * n + 1));
			}
		},
		"array": function() {
				return Math.floor(Math.random()*(n[1]-n[0])+n[0]);
		}
	});
}

/*
	TODO: UPGRADE to use $j.methods();
	TODO: improve overload to use jQuery.isNumeric("47") > ref: ifNum() in frame.trivia.js
 */
function overload(x, functions, context) {
	var thisFunction = functions[jQuery.type(x)];
	if(thisFunction) {
		if(!context) {
			return thisFunction(x);
		}
		return thisFunction.apply(context, [x])
	}

	// depreating default method > prefer to use def but need backwards compatibility
	var defFunction = functions.def||functions.default;
	if(defFunction) {
		if(!context) {
			return defFunction(x);
		}
		return defFunction.apply(context, [x])
	}
}

// localStorage plugin > need to integrate deeper into
// jQuery.what() > jQuery.what(true, "key", {})
!function(a){function b(){if(f.localStorage)try{e=j(String(f.localStorage))}catch(a){f.localStorage="{}"}else f.localStorage="{}";h=f.localStorage?String(f.localStorage).length:0}function c(){try{f.localStorage=i(e),g&&(g.setAttribute("localStorage",f.localStorage),g.save("localStorage")),h=f.localStorage?String(f.localStorage).length:0}catch(a){}}function d(a){if(!a||"string"!=typeof a&&"number"!=typeof a)throw new TypeError("Key name must be string or numeric");return!0}if(!a||!a.toJSON&&!Object.toJSON&&!window.JSON)throw Error("jQuery, MooTools or Prototype needs to be loaded before localStorage!");var e={},f={localStorage:"{}"},g=null,h=0,i=a.toJSON||Object.toJSON||window.JSON&&(JSON.encode||JSON.stringify),j=a.evalJSON||window.JSON&&(JSON.decode||JSON.parse)||function(a){return String(a).evalJSON()},k=!1,l={isXML:function(a){return!!(a=(a?a.ownerDocument||a:0).documentElement)&&"HTML"!==a.nodeName},encode:function(a){if(!this.isXML(a))return!1;try{return(new XMLSerializer).serializeToString(a)}catch(b){try{return a.xml}catch(a){}}return!1},decode:function(a){var b="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(a){var b=new ActiveXObject("Microsoft.XMLDOM");return b.async="false",b.loadXML(a),b};return!!b&&(a=b.call("DOMParser"in window&&new DOMParser||window,a,"text/xml"),!!this.isXML(a)&&a)}};a.localStorage={version:"0.1.5.4",set:function(a,b){return d(a),l.isXML(b)&&(b={_is_xml:!0,xml:l.encode(b)}),e[a]=b,c(),b},get:function(a,b){return d(a),a in e?e[a]&&"object"==typeof e[a]&&e[a]._is_xml&&e[a]._is_xml?l.decode(e[a].xml):e[a]:"undefined"==typeof b?null:b},deleteKey:function(a){return d(a),a in e&&(delete e[a],c(),!0)},flush:function(){return e={},c(),!0},storageObj:function(){function a(){}return a.prototype=e,new a},index:function(){var b,a=[];for(b in e)e.hasOwnProperty(b)&&a.push(b);return a},storageSize:function(){return h},currentBackend:function(){return k},storageAvailable:function(){return!!k},reInit:function(){var a;if(g&&g.addBehavior){a=document.createElement("link"),g.parentNode.replaceChild(a,g),g=a,g.style.behavior="url(#default#userData)",document.getElementsByTagName("head")[0].appendChild(g),g.load("localStorage"),a="{}";try{a=g.getAttribute("localStorage")}catch(a){}f.localStorage=a,k="userDataBehavior"}b()}},function(){var a=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),a=!0,window.localStorage.removeItem("_tmptest")}catch(a){}if(a)try{window.localStorage&&(f=window.localStorage,k="localStorage")}catch(a){}else if("globalStorage"in window)try{window.globalStorage&&(f=window.globalStorage[window.location.hostname],k="globalStorage")}catch(a){}else{if(g=document.createElement("link"),!g.addBehavior)return void(g=null);g.style.behavior="url(#default#userData)",document.getElementsByTagName("head")[0].appendChild(g),g.load("localStorage"),a="{}";try{a=g.getAttribute("localStorage")}catch(a){}f.localStorage=a,k="userDataBehavior"}b()}()}(window.jQuery||window.$);

/***************************************************************************
 * Log4js - Borrowed (abused) from Java
 ***************************************************************************/
var LOG_LEVEL="debug",LOG_OUTPUT_ELEMENT_ID="Log4jsLogOutput",Log4js={logger:null,logElement:null,debug:function(){"debug"===LOG_LEVEL&&Log4js._log.apply(Log4js._log,arguments)},info:function(){"info"!==LOG_LEVEL&&"debug"!==LOG_LEVEL||Log4js._log.apply(Log4js._log,arguments)},error:function(){Log4js._log.apply(Log4js._log,arguments)},_log:function(){if(!Log4js.logger){var a=window.console;a&&a.log&&(a.log.apply?Log4js.logger=a.log:"object"==typeof a.log&&Function.prototype.bind?Log4js.logger=Function.prototype.bind.call(a.log,a):"object"==typeof a.log&&Function.prototype.call&&(Log4js.logger=function(){Function.prototype.call.call(a.log,a,Array.prototype.slice.call(arguments))})),logElement=document.getElementById(LOG_OUTPUT_ELEMENT_ID)}if(Log4js.logger&&Log4js.logger.apply(window.console,arguments),logElement){for(var b="",c=0;c<arguments.length;c++)b+=arguments[c]+" ";logElement.innerHTML+=b+"\n";var d=logElement.innerHTML.split("\n");d.length>100&&(logElement.innerHTML=d.slice(-100).join("\n"))}}};


/*
	Timer
	http://jsfiddle.net/thoughtleader/ZWQMW/1/

	var timePeriod = "1s",
		timerName = "timerOne"; // timerName is never required but helps with management if many timers exist
	$("div.two").oneTime(timePeriod, timerName, function() {
		$(this).toggleClass("bold");
	});

	var timePeriod = 500,
		timerName = "timerTwo",
		times = 0; // setting times to 0 makes it run until cancelled
	$("div.three").everyTime(timePeriod, timerName, function() {
		$(this).toggleClass("bold");
	}, times);
 */
jQuery.fn.extend({everyTime:function(a,b,c,d,e){return this.each(function(){jQuery.timer.add(this,a,b,c,d,e)})},oneTime:function(a,b,c){return this.each(function(){jQuery.timer.add(this,a,b,c,1)})},stopTime:function(a,b){return this.each(function(){jQuery.timer.remove(this,a,b)})}}),jQuery.extend({timer:{guid:1,global:{},regex:/^([0-9]+)\s*(.*s)?$/,powers:{ms:1,cs:10,ds:100,s:1e3,das:1e4,hs:1e5,ks:1e6},timeParse:function(a){if(void 0==a||null==a)return null;var b=this.regex.exec(jQuery.trim(a.toString()));if(b[2]){var c=parseInt(b[1],10),d=this.powers[b[2]]||1;return c*d}return a},add:function(a,b,c,d,e,f){var g=0;if(jQuery.isFunction(c)&&(e||(e=d),d=c,c=b),b=jQuery.timer.timeParse(b),!("number"!=typeof b||isNaN(b)||b<=0)){e&&e.constructor!=Number&&(f=!!e,e=0),e=e||0,f=f||!1,a.$timers||(a.$timers={}),a.$timers[c]||(a.$timers[c]={}),d.$timerID=d.$timerID||this.guid++;var h=function(){f&&this.inProgress||(this.inProgress=!0,(++g>e&&0!==e||d.call(a,g)===!1)&&jQuery.timer.remove(a,c,d),this.inProgress=!1)};h.$timerID=d.$timerID,a.$timers[c][d.$timerID]||(a.$timers[c][d.$timerID]=window.setInterval(h,b)),this.global[c]||(this.global[c]=[]),this.global[c].push(a)}},remove:function(a,b,c){var e,d=a.$timers;if(d){if(b){if(d[b]){if(c)c.$timerID&&(window.clearInterval(d[b][c.$timerID]),delete d[b][c.$timerID]);else for(var c in d[b])window.clearInterval(d[b][c]),delete d[b][c];for(e in d[b])break;e||(e=null,delete d[b])}}else for(b in d)this.remove(a,b,c);for(e in d)break;e||(a.$timers=null)}}}});

/*	
	Hover Intent
	https://briancherne.github.io/jquery-hoverIntent/
*/
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):jQuery&&!jQuery.fn.hoverIntent&&a(jQuery)}(function(a){"use strict";var d,e,b={interval:100,sensitivity:6,timeout:0},c=0,f=function(a){d=a.pageX,e=a.pageY},g=function(a,b,c,h){return Math.sqrt((c.pX-d)*(c.pX-d)+(c.pY-e)*(c.pY-e))<h.sensitivity?(b.off(c.event,f),delete c.timeoutId,c.isActive=!0,a.pageX=d,a.pageY=e,delete c.pX,delete c.pY,h.over.apply(b[0],[a])):(c.pX=d,c.pY=e,c.timeoutId=setTimeout(function(){g(a,b,c,h)},h.interval),void 0)},h=function(a,b,c,d){return delete b.data("hoverIntent")[c.id],d.apply(b[0],[a])};a.fn.hoverIntent=function(d,e,i){var j=c++,k=a.extend({},b);a.isPlainObject(d)?(k=a.extend(k,d),a.isFunction(k.out)||(k.out=k.over)):k=a.isFunction(e)?a.extend(k,{over:d,out:e,selector:i}):a.extend(k,{over:d,out:d,selector:e});var l=function(b){var c=a.extend({},b),d=a(this),e=d.data("hoverIntent");e||d.data("hoverIntent",e={});var i=e[j];i||(e[j]=i={id:j}),i.timeoutId&&(i.timeoutId=clearTimeout(i.timeoutId));var l=i.event="mousemove.hoverIntent.hoverIntent"+j;if("mouseenter"===b.type){if(i.isActive)return;i.pX=c.pageX,i.pY=c.pageY,d.off(l,f).on(l,f),i.timeoutId=setTimeout(function(){g(c,d,i,k)},k.interval)}else{if(!i.isActive)return;d.off(l,f),i.timeoutId=setTimeout(function(){h(c,d,i,k.out)},k.timeout)}};return this.on({"mouseenter.hoverIntent":l,"mouseleave.hoverIntent":l},k.selector)}});
