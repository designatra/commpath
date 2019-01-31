import sitespecific from '../../studio/js/modify/sitespecific.js';

(function($j) {
	var plugin = {
		name:"actors",
		methods: {},
		init:false,
		requests:{},
		data: {
			loaded:{
				events:false
			}
		},
		events: {
			def: function() {

			}
		}
	};

	plugin.methods.dom = {
		/*
			$j(context).actors({
				type:"links"
			});

			$j(context).actors({
				type:"links",
				json: json
			});
		*/
		init: function(o) {
			$j.actors("events", $j(this), o);

			return jQuery(this);
		},
		events: function() {

		}
	};

	var util = plugin.methods.util = {
		/*
			$j.actors();

			$j.actors({
				after:function() {
					// EVENT ALSO FIRES ON BODY
				}
			})
		*/
		init: function(o) {
			plugin.init=true;

			$j.getScript("js/modify/actors.events.js", function() {
				$j("body").trigger("actorsLoaded");
				console.log("GOT FILE", sitespecific)
				if(o){
					if(o.after) {
						return o.after();
					};
				};
			});
		},

		/*
			Called after above utility pulls the event registry (actors.events.js)
		*/
		register:function(o){
			$j.extend(plugin.events, o);
		},
		/*
			$j.actors("events", context, type, json)
		*/
		events: function(context, o) {
			var events = plugin.events;

			var event = events[o.type];
			if(!event) {
				event = events.def;
			}

			event.apply(context, arguments);

			return context;
		}
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(a){var b=plugin.methods.dom;if(b[a]){return b[a].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof a==="object"||!a){return b.init.apply(this,arguments)}else{jQuery.error("Method "+a+" does not exist on jQuery(el)."+plugin.name)}};jQuery[plugin.name]=function(a){if(jQuery.isNumeric(a)){a=parseInt(a)}var b=plugin.methods.util;if(b[a]){return b[a].apply(b,Array.prototype.slice.call(arguments,1))}else if(typeof a==="object"||!a||plugin.data[a]||jQuery.isNumeric(a)){return b.init.apply(b,arguments)}else{jQuery.error("Method "+a+" does not exist on jQuery."+plugin.name)}}
})(jQuery);
