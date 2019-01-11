(function($j) {
	var plugin = {
		name: "studio",
		methods: {},
		init: false,
		data: {},
		vis:{}
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
    encode: function($el) {
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
    	var $svg = $j("<div></div>").build("svg.node", data, {
    		populate: function(i, o) {
    			return o;
		    }
	    });

	    return privates.encode($svg[0].outerHTML);
    },
		/*
		    $j.studio("nodes", $j.o("nodes"));
		*/
		nodes: function processNodes(nodeList) {
			var nodes = [];
			$j.each(nodeList, function() {
				var node = this;

				//node.title = ???
				node.logistics.label = $j.o("application", this.entity.id);
				node.image = $j.studio("node", this.logistics);
				node.shape = "image";

				nodes.push(node);
			});
			return nodes;
		},
		addEdge: function(edge) {

		},
		/*
				$j.studio("updatePath", "digitalComm1")
				$j.studio("updatePath", "digitalComm1", 2)
		*/
		updatePath: function(id, path) {
			var pathIndex = defined(path, random([1,5]))
			$j.log("Activating Path:", pathIndex);
			$j.studio("updateEdges", $j.o("path", id, pathIndex), "active");
		},
		/*
				$j.studio("updateEdges", [{...},{...},...]);
		*/
		updateEdges: function(edges, state) {
			var activeEdges = privates.activeEdges();//$j.studio("activeEdges")
			//$j.o("vis", "edges").getIds()

			$j.each(edges, function(i, edge) {
				if(activeEdges[edge.id]) {
					delete activeEdges[edge.id];
				};

				privates.updateEdge(edge, state);
			});

			$j.each(activeEdges, function(i, edge) {
				privates.updateEdge(edge, "inactive");
			});
		},
		/*
				$j.studio("updateEdge", {...});
				$j.studio("updateEdge", {...}, "active");
		*/
		updateEdge: function(edge, state) {
			var o = $j.extend({}, edge);
			$j.methods(state, {
				active: function() {
					o.state = "active";
					o.color = {
						color: "#1778d3"
						//highlight:blue
						//opacity:.3
						//inherit:'both', 'to', 'from'
					};
				},
				inactive: function() {
					o.state = "inactive";
					o.color = {
						color: "rgba(0,0,0,0)"
					};
				}
			});

			$j.o("vis", "edges").update(o);
		},
		/*
				$j.studio("activeEdges")
		*/
		activeEdges: function() {
			var edges = $j.o("vis", "edges");
			var activeEdges = {};
			edges.get({
				filter: function (edge) {
					if(edge.state == "active") {
						activeEdges[edge.id] = edge;
					}
				}
			});

			return activeEdges;
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
