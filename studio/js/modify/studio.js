(function($j) {
	var plugin = {
		name: "studio",
		methods: {},
		init: false,
		data: {}
	};

	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
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
        $j.studio("encode", svg);
    */
    encode: function($el) {console.log($el)
		  return "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent($el);
    },
    /*
        $j.studio("node", {
          in:597,
	        out:509,
	        duds:{
	          biz:88,
	          it:0,
	          planned:0
	        }
	       });
    */
    node: function(data) {
    	var $svg = $j("<wrapper></wrapper>").build("svg.node", data);

	    return privates.encode($svg[0]);
    },
		/*
		    $j.studio("nodes", $j.o("nodes"));
		*/
		nodes: function processNodes(nodeList) {
			var nodes = [];
			$j.each(nodeList, function() {
				var node = this;

				//node.title = ???
				node.label = $j.o("application", this.entity.id);
				node.image = $j.studio("node", this.logistics);
				node.shape = "image";

				nodes.push(node);
			});
			return nodes;
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
