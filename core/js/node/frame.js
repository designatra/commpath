/*
	dollarJ Utils from frame.js
	----------------------------------------------------------------------------------------------------------

	TODO: Abstract into module(s)
*/


var $j = module.exports = {}

//$j.__= require("underscore");
/*
	https://lodash.com/

	Can include specific modules versus whole lib
*/
var _= require("lodash");

// https://www.npmjs.com/package/typeof
$j.typeOf = require("typeof");

/*
	$j.methods("methodTwo", {
		methodOne: function() {

		},
		methodTwo: function() {
			$j.log("This method will be called with the $j('body') as the context")
		},
		methodThree: function() {

		},
		def: function() {
			$j.log("This is the default method that will be called if the method specified doesn't exists in functions")
		}
	}, $j("body"));
*/
$j.methods = function(x, functions, context) {
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
	return thisFunction.apply($j.defined(context, functions), arguments);
};

/*
	var context = {
		name:"parrot",
		type:"animal"
	};

	$j. overload(x, {
		"string":function() {
	
		},
		array: function() {
	
		},
		undefined: function() {
	
		},
		def: function() {
	
		}
	}, context);

 	TODO: Should be using $j.methods as core logic/structure
 */
$j.overload = function(x, functions, context) {
	var thisFunction = functions[$j.typeOf(x)];
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
};

/*
	Retruns what if it is defined other returns 2nd parameter if not defined

	$j.defined(ifNotThis, thanReturnThis);
*/
$j.defined = function(what, ifNot) {
	if ($j.typeOf(ifNot) === "undefined") ifNot = false;
	if ($j.typeOf(what) !== "undefined") {
		if (what) {
			if ($j.typeOf(what) == "string") {
				try {
					return JSON.parse(what);
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
};

/*
	https://www.npmjs.com/package/log4js
*/
// var log4js = require("log4js");
// log4js.configure({
// 	appenders: [
// 		{
// 			type: 'console',
// 			layout: {
// 				type: 'pattern',
// 				pattern: "[%r] [%[%5.5p%]]"
// 			}
// 		}
// 	]
// });
$j.log = function() {
	// var args = [];
	// var i = 0;
	// _.forEach(arguments, function( arg, val ) {
	// 	if( i++ == 0 )
	// 		return;
	// 	args.push( arg );
	// });

	//return log4js.getLogger().info(x)
	return console.log.apply(null, arguments)
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
	return this.slice(Math.max(this.length - n, 0));
}
