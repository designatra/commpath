(function($j) {
	var plugin = {
		name: "validate",
		methods: {},
		init: false,
		data: {}
	};
	plugin.methods.dom = {
		init: function(x) {
			return overload(x, {
				/*
					$j("field#email").validate("email")
					$j("field#email input").validate("email")

					Validates: 
						1. Value of the passed input element
						2. Searches for first input and validates
				*/
				string: function() {
					return $j.validate("rule", x, privates.$input($j(this)).val());
				},
				/*
					$j("input").validate({
						rule:"email"
					});
				*/
				object: function() {
					return $j.validate("rule", x.rule, privates.$input($j(this)).val());
				},
				/*
					$j("input").validate();

					Uses field type (stored in data) to discover rule			
		
					{
						type:"email",	<<<<<    uses regEx returned from > plugin.patterns.email
						id:"email",
						label:"email"
					}
				*/
				undefined: function() {
					var field = $j(this).field(),
						inputValue = $j(this).field("input");

					var valid = true;
					if(field.rules) {
						valid = $j.validate("rules", field.rules, inputValue)
					}
					if(valid===true) {
						valid = $j.validate("pattern", field.type, inputValue);
					}
					
					return valid;
				}
			}, $j(this));
		}
	};
	

	var util = plugin.methods.util = {
		init: function(x, y, z) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x](y, z);
					}
					// if method name but no private method registered
					// helpful with data calls $j.o("undefinedMethod") would key off data in $j.what()
					return plugin.privates.core()[x];
				},
				object: function() {
					return $j();
				},
				// if no parameters > $j.o()
				undefined: function() {
					return plugin.privates.core();
				}
			});
		},
		/*
			$j.validate("pattern", "email", "email@michaelevan.com")
		*/
		pattern: function(name, value) {
			var pattern = privates.pattern(name);

			return pattern.test(value);
		},
		/*
			$j.validate("rules", [
				{
					minLength:3
				},
				{
					maxLength:40
				}
			], "Michael Kelly")
		*/
		rules: function(a, value) {
			var valid = true;
			$j.each(a, function(i, rule) {
				valid = util.rule(rule, value);
				return valid;
			});
			return valid;
		},
		/*
			$j.validate("rule", {
				minLength:3
			}, "Michael Kelly")
		*/
		rule: function(o, value) {
			// Consider > Object.keys(rule);
			var valid = true;
			$j.each(o, function(name, configValue) {
				valid = rules[name](value, configValue);
			});
			return valid;
		}
	};

	/*
		Ideally these could created when fragment creates elements
	*/
	var privates = plugin.privates = {
		core: function() {
			return $j.what();
		},
		/*
			privates.pattern("email")
		*/
		pattern: function(name, o) {
			var pattern = patterns[name];
			if(!pattern) {
				return false;
			}
			return new RegExp(pattern);

			// overload(pattern, {
			// 	regex: function() {
			// 		new RegExp(pattern);
			// 	},
			// 	function: function() {

			// 	},
			// 	undefined: function() {

			// 	}
			// });
		},
		/*
			Return input or searches for input and return it
			privates.$input($j("#email"))
		*/
		$input: function($el) {
			var $input = $el;
			if(!$input.is("input")) {
				$input = $el.find("input:first");
			}
			return $input;
		}
	}

	/*
		Collection of CORE RegEx Patterns
	*/
	var patterns = plugin.patterns = {
		//notEmpty:/^.{1}/,
		name: /^([a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$)/i, //i.e. John, Sally,
		/*
			Validates full name allowing special characters such as periods, commas, spaces, apostrophes, and dashes are allowed.
			https://regex101.com/r/nR3bK0/1

			Matches 		Mathias d'Arras | Martin Luther King, Jr. | Hector Sausage-Hausen
		*/
		"name-full": /^[a-z ,.'-]+$/i, //  /^[A-Z][a-z-]+[a-z]+([\s][A-Z][a-z-]+[a-z])?$/, // John Doe > 3 letter min
		abc: /[A-Za-z]/i,
		numeric:/\d/, //123
		alphanumeric:/\w/, //abc_
		phone: /^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/i,
		email: /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$)/i, //john@doe.com
		address: /^([a-zA-Z0-9]+[\s]*[a-zA-Z0-9.\-\,\#]+[\s]*[a-zA-Z0-9.\-\,\#]+[a-zA-Z0-9\s.\-\,\#]*$)/i, //123 E DRACHMAN
		city: /^()/i, //Phoenix, San Francisco
		state: /^((?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$)/i, //AL, CA, WA..
		zip: /^(^\d{5}(-\d{4})?$)/i, //48222 or 48222-1746
		date: /^(\d{1,2}\/\d{1,2}\/\d{4}$)/i, //12/31/2010
		password: /^\S{8,}$/, // /^[a-z0-9_-]{8,16}$/, // letters, numbers, underscores, hyphens
		passwordOneNumber: /^(?=.*\d).{4,8}$/i,	 //8 characters with at least <b>1</b> number,
		url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, // http://www.google.com/site
		html: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w�\.-]*)*\/?$/ //<a href="http://google.com/">Google</a>,
	};
	patterns.vin = patterns.numeric///^(?:([A-HJ-NPR-Z]){3}|\d{3})(?1){2}\d{2}(?:(?1)|\d)(?:\d|X)(?:(?1)+\d+|\d+(?1)+)\d{6}$/i;
	/*
		Collection of EXTENDED RegEx Patterns > May refer to or alias core
		TODO: some of these are extended patterns, refactor what isn't into core patterns object
	*/

	/*
		Optional leading dollar sign, optional well-formed comma separator dollar amount 
		http://www.regexlib.com/REDetails.aspx?regexp_id=1005

		Matches 		$1,234,567.89 | 1234567.89 | $9.99
		Non-Matches	$1,2345,67.89 | $1234,345,678.0 | 0
	*/
	patterns.$amount = /^(\$|)([0-9]\d{0,2}(\,\d{3})*|([0-9]\d*))(\.\d{2})?$/ ;
	
	/*
		Credit Card Validation. Matches Switch/Solo, Visa, MasterCard and Discover in 4-4-4-4/4 4 4 4/4444 format 
		and Amex in 4-6-5/4 6 5/465 format. Includes checks for prefixes, (67 for switch/solo, 4 for visa, 51-55 for 
		MasterCard, 37/34 for Amex and 6011 for Discover. Matches all major UK debit and credit cards with 
		spaces dashes or as a continous number
		http://www.regexlib.com/REDetails.aspx?regexp_id=1205

		Matches			4234 1234 1234 1234 | 5434123412341234 | 3712 123456 12345
	*/
	patterns["cc-number"] = /^((67\d{2})|(4\d{3})|(5[1-5]\d{2})|(6011))(-?\s?\d{4}){3}|(3[4,7])\d{2}-?\s?\d{6}-?\s?\d{5}$/;
	
	/*
		Allows you to check the length of a number (in this case either 3 or 4 digits). I found it useful when 
		validating Credit Card Identification Codes (CVV2/CVC2/CID) which are either 3 or 4 numerical digits.
		http://www.regexlib.com/REDetails.aspx?regexp_id=908

		Matches			123 | 1234
		Non-Matches		12 | 12345
	*/
	patterns["cc-cvc"] = /^([0-9]{3,4})$/;
	
	/*
		Validates major credit card expiration dates MM/YYYY MMYY MMYYYY MM/YYYY
		https://regex101.com/r/gN5wH2/1
		
		Matches			02/13 0213 022013 02/2013
		Non-Matches		02/203 02/2 02/20322
	*/
	patterns["cc-date"] = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
	patterns["cc-name"] = patterns["name-full"];
	patterns["cc-zip"] = patterns.zip;
	
	patterns["address-street"] = patterns.address;
	patterns["address-city"] = patterns.city;
	patterns["address-state"] = patterns.state;
	patterns["address-zip"] = patterns.zip;
	
	patterns["bank-accountHolder"] = patterns["name-full"];
	/*
		Account number should always be a numeric 15-digit number 
		(could also validate with numeric pattern + exactLength rule)

		Matches 			219382102243434
	*/
	patterns["bank-account"] = /^(\d){15}$/;
	/*
		Routing number should always be a numeric 9-digit number 
		(could also validate with numeric pattern + exactLength rule)

		Matches 			738293847
	*/
	patterns["bank-routing"] = /^(\d){9}$/;


	var rules = plugin.rules = {
		/*
			rules.minLength("Michael Kelly", 3);
			TODO: Evaluate using patterns > 
				Range	 	/^[a-zA-Z]{3,7}$/
				Exact 		/^[a-zA-Z]{7}$/
				Minimum	/^[a-zA-Z]{3,}$/	
		*/
		minLength: function(str, length) {
			if(str.length>=length) {
				return true;
			}
			return false;
		},
		/*
			rules.maxLength("Michael Kelly", 40);
		*/
		maxLength: function(str, length) {
			if(str.length<=length) {
				return true;
			}
			return false;
		},
		exactLength: function(str, length) {
			if(str.length==length) {
				return true;
			}
			return false;
		},
		/*
			rules.totalWords("Michael Kelly", 2);
		*/
		totalWords: function(str, length) {
			if(str.split(" ").length==length) {
				return true;
			}
			return false;
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
