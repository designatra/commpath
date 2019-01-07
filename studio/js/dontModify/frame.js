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
		.data("cache", {});

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
		log: Log4js.debug,
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
		random: function(length, noPrefix) {
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
				string_length = defined(length, 12) - 5,
				randomstring = '';
			for(var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}
			return "DIGIT" + randomstring;
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
		overload: overload
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

/* 1. Quantity  2. Element Type 3. Parent Class (whom new elements will be children of) 4. New Element Class 5. HTML content */

function add(howMany, elementType, parentClass, className, theId, theHtml) {
	var i = howMany;
	switch(elementType) {
	case "file":
	case "password":
	case "input":
	case "radio":
	case "number":
	case "checkbox":
		while(i--) {
			if(elementType == "input") {
				var elementType = "text";
			}
			//var el = jQuery("<input type='"+elementType+"'></input>").appendTo(jQuery(parentClass));
			var el = jQuery("<input type='" + elementType + "' />").appendTo(jQuery(parentClass));
			el.attr({
				"id": theId,
				"class": className
			});
			if(theHtml) {
				el.html(theHtml);
			}
		}
		return el;
		break;
	default:
		var fragment = document.createDocumentFragment(),
			div = document.createElement(elementType);
		while(i--) {
			var newObject = jQuery(fragment.appendChild(div.cloneNode(true))).attr({
				"id": theId,
				"class": className + " mekTemp"
			});
			if(theHtml) {
				newObject.html(theHtml);
			}
		}
		return jQuery(jQuery(parentClass).append(fragment)[0]).children(".mekTemp").removeClass("mekTemp");
		break;
	}
}

function addElements(howMany, elementType, parentClass, className, theHtml) {
	add(howMany, elementType, parentClass, className, theHtml);
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
function overload(x, functions) {
	var thisFunction = functions[jQuery.type(x)];
	if(thisFunction) {
		return thisFunction(x);
	}
	if(functions.default) {
		return functions.default();
	}
	return false;
}

// localStorage plugin > need to integrate deeper into
// jQuery.what() > jQuery.what(true, "key", {})
(function(e) {
	function k() {
		if(d.localStorage) try {
			c = l(String(d.localStorage))
		} catch(a) {
			d.localStorage = "{}"
		} else d.localStorage = "{}";
		g = d.localStorage ? String(d.localStorage).length : 0
	}

	function h() {
		try {
			d.localStorage = m(c), b && (b.setAttribute("localStorage", d.localStorage), b.save("localStorage")), g = d.localStorage ? String(d.localStorage).length : 0
		} catch(a) {}
	}

	function i(a) {
		if(!a || typeof a != "string" && typeof a != "number") throw new TypeError("Key name must be string or numeric");
		return true
	}

	if(!e || !e.toJSON && !Object.toJSON && !window.JSON) throw Error("jQuery, MooTools or Prototype needs to be loaded before localStorage!");
	var c = {},
		d = {
			localStorage: "{}"
		},
		b = null,
		g = 0,
		m = e.toJSON || Object.toJSON || window.JSON && (JSON.encode || JSON.stringify),
		l = e.evalJSON || window.JSON && (JSON.decode || JSON.parse) ||
	function(a) {
		return String(a).evalJSON()
	}, f = false, j = {
		isXML: function(a) {
			return(a = (a ? a.ownerDocument || a : 0).documentElement) ? a.nodeName !== "HTML" : false
		},
		encode: function(a) {
			if(!this.isXML(a)) return false;
			try {
				return(new XMLSerializer).serializeToString(a)
			} catch(b) {
				try {
					return a.xml
				} catch(c) {}
			}
			return false
		},
		decode: function(a) {
			var b = "DOMParser" in window && (new DOMParser).parseFromString || window.ActiveXObject &&
			function(a) {
				var b = new ActiveXObject("Microsoft.XMLDOM");
				b.async = "false";
				b.loadXML(a);
				return b
			};
			if(!b) return false;
			a = b.call("DOMParser" in window && new DOMParser || window, a, "text/xml");
			return this.isXML(a) ? a : false
		}
	};
	e.localStorage = {
		version: "0.1.5.4",
		set: function(a, b) {
			i(a);
			j.isXML(b) && (b = {
				_is_xml: true,
				xml: j.encode(b)
			});
			c[a] = b;
			h();
			return b
		},
		get: function(a, b) {
			i(a);
			return a in c ? c[a] && typeof c[a] == "object" && c[a]._is_xml && c[a]._is_xml ? j.decode(c[a].xml) : c[a] : typeof b == "undefined" ? null : b
		},
		deleteKey: function(a) {
			i(a);
			return a in c ? (
			delete c[a], h(), true) : false
		},
		flush: function() {
			c = {};
			h();
			return true
		},
		storageObj: function() {
			function a() {}
			a.prototype = c;
			return new a
		},
		index: function() {
			var a = [],
				b;
			for(b in c) c.hasOwnProperty(b) && a.push(b);
			return a
		},
		storageSize: function() {
			return g
		},
		currentBackend: function() {
			return f
		},
		storageAvailable: function() {
			return !!f
		},
		reInit: function() {
			var a;
			if(b && b.addBehavior) {
				a = document.createElement("link");
				b.parentNode.replaceChild(a, b);
				b = a;
				b.style.behavior = "url(#default#userData)";
				document.getElementsByTagName("head")[0].appendChild(b);
				b.load("localStorage");
				a = "{}";
				try {
					a = b.getAttribute("localStorage")
				} catch(c) {}
				d.localStorage = a;
				f = "userDataBehavior"
			}
			k()
		}
	};
	(function() {
		var a = false;
		if("localStorage" in window) try {
			window.localStorage.setItem("_tmptest", "tmpval"), a = true, window.localStorage.removeItem("_tmptest")
		} catch(c) {}
		if(a) try {
			if(window.localStorage) d = window.localStorage, f = "localStorage"
		} catch(e) {} else if("globalStorage" in window) try {
			window.globalStorage && (d = window.globalStorage[window.location.hostname], f = "globalStorage")
		} catch(g) {} else if(b = document.createElement("link"), b.addBehavior) {
			b.style.behavior = "url(#default#userData)";
			document.getElementsByTagName("head")[0].appendChild(b);
			b.load("localStorage");
			a = "{}";
			try {
				a = b.getAttribute("localStorage")
			} catch(h) {}
			d.localStorage = a;
			f = "userDataBehavior"
		} else {
			b = null;
			return
		}
		k()
	})()
})(window.jQuery || window.$);

/***************************************************************************
 * Log4js - Borrowed (abused) from Java
 ***************************************************************************/
var LOG_LEVEL = "debug",
	LOG_OUTPUT_ELEMENT_ID = 'Log4jsLogOutput';

var Log4js = {
	logger: null,
	logElement: null,
	debug: function() {
		if (LOG_LEVEL === 'debug') {
			Log4js._log.apply(Log4js._log, arguments);
		}
	},
	info: function() {
		if ((LOG_LEVEL === 'info') || (LOG_LEVEL === 'debug')) {
			Log4js._log.apply(Log4js._log, arguments);
		}
	},
	error: function() {
		Log4js._log.apply(Log4js._log, arguments);
	},
	_log: function() {
		if (!Log4js.logger) {
			var console = window.console;
			if (console && console.log) {
				if (console.log.apply) {
					Log4js.logger = console.log;
				} else if ((typeof console.log === "object") && Function.prototype.bind) {
					Log4js.logger = Function.prototype.bind.call(console.log, console);
				} else if ((typeof console.log === "object") && Function.prototype.call) {
					Log4js.logger = function() {
						Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
					};
				}
			}
			logElement = document.getElementById(LOG_OUTPUT_ELEMENT_ID);
		}

		if (Log4js.logger) {
			Log4js.logger.apply(window.console, arguments);
		}

		if (logElement) {
			var str = '';
			for (var i = 0; i < arguments.length; i++) {
				str += arguments[i] + " ";
			}
			logElement.innerHTML += str + '\n';

			var lines = logElement.innerHTML.split('\n');
			if (lines.length > 100) {
				logElement.innerHTML = lines.slice(-100).join('\n');
			}
		}
	}
};


/*
	jQuery Timer
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
jQuery.fn.extend({
	everyTime: function(e, t, n, r, i) {
		return this.each(function() {
			jQuery.timer.add(this, e, t, n, r, i)
		})
	},
	oneTime: function(e, t, n) {
		return this.each(function() {
			jQuery.timer.add(this, e, t, n, 1)
		})
	},
	stopTime: function(e, t) {
		return this.each(function() {
			jQuery.timer.remove(this, e, t)
		})
	}
});
jQuery.extend({
	timer: {
		guid: 1,
		global: {},
		regex: /^([0-9]+)\s*(.*s)?$/,
		powers: {
			ms: 1,
			cs: 10,
			ds: 100,
			s: 1e3,
			das: 1e4,
			hs: 1e5,
			ks: 1e6
		},
		timeParse: function(e) {
			if (e == undefined || e == null) return null;
			var t = this.regex.exec(jQuery.trim(e.toString()));
			if (t[2]) {
				var n = parseInt(t[1], 10);
				var r = this.powers[t[2]] || 1;
				return n * r
			} else {
				return e
			}
		},
		add: function(e, t, n, r, i, s) {
			var o = 0;
			if (jQuery.isFunction(n)) {
				if (!i) i = r;
				r = n;
				n = t
			}
			t = jQuery.timer.timeParse(t);
			if (typeof t != "number" || isNaN(t) || t <= 0) return;
			if (i && i.constructor != Number) {
				s = !! i;
				i = 0
			}
			i = i || 0;
			s = s || false;
			if (!e.$timers) e.$timers = {};
			if (!e.$timers[n]) e.$timers[n] = {};
			r.$timerID = r.$timerID || this.guid++;
			var u = function() {
				if (s && this.inProgress) return;
				this.inProgress = true;
				if (++o > i && i !== 0 || r.call(e, o) === false) jQuery.timer.remove(e, n, r);
				this.inProgress = false
			};
			u.$timerID = r.$timerID;
			if (!e.$timers[n][r.$timerID]) e.$timers[n][r.$timerID] = window.setInterval(u, t);
			if (!this.global[n]) this.global[n] = [];
			this.global[n].push(e)
		},
		remove: function(e, t, n) {
			var r = e.$timers,
				i;
			if (r) {
				if (!t) {
					for (t in r) this.remove(e, t, n)
				} else if (r[t]) {
					if (n) {
						if (n.$timerID) {
							window.clearInterval(r[t][n.$timerID]);
							delete r[t][n.$timerID]
						}
					} else {
						for (var n in r[t]) {
							window.clearInterval(r[t][n]);
							delete r[t][n]
						}
					}
					for (i in r[t]) break;
					if (!i) {
						i = null;
						delete r[t]
					}
				}
				for (i in r) break;
				if (!i) e.$timers = null
			}
		}
	}
});
// if (jQuery.support.msie) jQuery(window).one("unload", function() {
// 	var e = jQuery.timer.global;
// 	for (var t in e) {
// 		var n = e[t],
// 			r = n.length;
// 		while (--r) jQuery.timer.remove(n[r], t)
// 	}
// });



/*
	hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 	http://cherne.net/brian/resources/jquery.hoverIntent.html

	$("#demo1").hoverIntent( handlerIn, handlerOut )
	$("#demo2").hoverIntent( handlerInOut )
	$("#demo3").hoverIntent( handlerIn, handlerOut, selector )
	$("#demo4").hoverIntent( handlerInOut, selector )
	$("#demo5").hoverIntent({
	    over: makeTall,
	    out: makeShort,
	    selector: 'li'
	});

 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery);



/*!
 * accounting.js v0.3.2, copyright 2011 Joss Crowcroft, MIT license, http://josscrowcroft.github.com/accounting.js
 */
 /*
 	formatMoney() - format any number into currency

		Default usage:
		accounting.formatMoney(12345678); // $12,345,678.00

		European formatting (custom symbol and separators), could also use options object as second param:
		accounting.formatMoney(4999.99, "€", 2, ".", ","); // €4.999,99

		Negative values are formatted nicely, too:
		accounting.formatMoney(-500000, "£ ", 0); // £ -500,000

		Simple `format` string allows control of symbol position [%v = value, %s = symbol]:
		accounting.formatMoney(5318008, { symbol: "GBP",  format: "%v %s" }); // 5,318,008.00 GBP

	formatColumn() - format a list of values for column-display

		Format list of numbers for display:
		accounting.formatColumn([123.5, 3456.49, 777888.99, 12345678, -5432], "$ ");

	formatNumber() - format a number with custom precision and localisation

		accounting.formatNumber(5318008); // 5,318,008

		accounting.formatNumber(9876543.21, 3, " "); // 9 876 543.210

	toFixed() - better rounding for floating point numbers

		(0.615).toFixed(2); // "0.61"

		accounting.toFixed(0.615, 2); // "0.62"

	unformat() - get a value from any formatted number/currency string

		accounting.unformat("£ 12,345,678.90 GBP"); // 12345678.9
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.3.2",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);;


/*
BREAK: frame.js
*/
