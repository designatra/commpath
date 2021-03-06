import * as dj from '../../../core/js/frame.js';
import dayjs from 'dayjs'

(function($j) {
	var plugin = {
		name: "studio",
		methods: {},
		init: false,
		data: {},
		vis:{},
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
				TODO: Migrate to own util

				$j.studio("inRange", "2016-03-13", ["2016-03-10", "2016-03-15"])
				returns > TRUE or FALSE
		*/
		inRange: function(query, dates) {
				return dayjs(query).isBetween(dates[0], dates[1]);
		},
		/*
				$j.studio("filterPaths", ["2019-01-13T06:46:55-08:00", "2019-01-13T06:56:27-08:00"],"dateRange", function(contained, path) {
						$j.log("Iteration", contained, path)
				})
		*/
		filterPaths: function(haystack, filter, after) {
			var matches=[];
			var paths = $j.o("paths").history;
			$j.each(paths.map, function(timeStamp, index) {
				//var path = paths.log[index]

				var contained = privates.inRange(timeStamp, haystack);
				if(contained) {
					// NOTE: Not sure if looping again to accumulte is worth it > ahh, maybe have a callback
					matches.push(index);
				}

				if(after) {
					after(contained, paths.log[index]);
				}
			})
			return matches;
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
    			var total = 0;

			    var duds = o.duds;
			    if(duds) {
				    total = duds.biz + duds.it + duds.planned
			    } else {
			    	o.duds = {};
			    }

    			o.duds.total = total;

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
				if(this.entity) {
					node.logistics.label = $j.o("application", this.entity.id);
				}
				node.image = $j.studio("node", this.logistics);
				node.shape = "image";

				nodes.push(node);
			});
			return nodes;
		},
		/*
				$j.studio("resetNodes");
		*/
		resetNodes: function() {
			var nodes = [];

			// if(!$j.what("vis")) {
			// 	return false;
			// }
			$j.o("vis", "nodes").forEach(function(node) {
				node.logistics = $j.extend({}, node.logistics, {
					in:0,
					out:0,
					duds:{
						biz:0,
						it:0,
						planned:0
					}
				});

				nodes.push(node);
			});

			privates.updateNodes(nodes);
		},
		/*
				$j.studio("resetEdges")
	  */
		resetEdges: function() {
			//var edges = [];
			$j.o("vis", "edges").forEach(function(edge) {
				edge.state = "inactive";
				edge.color = {
					color: $j.o("color", "white_1")
				};
				edge.value = 0;
				$j.o("vis", "edges").update(edge)
			});

			//$j.o("vis", "edges").update(edges);
		},
		/*
				$j.studio("resetNetwork")
		*/
		resetNetwork: function() {
			privates.resetNodes();
			privates.resetEdges();
		},
		/*
				$j.studio("updateNodes", nodes);
		*/
		updateNodes: function(nodes) {
			return $j.o("vis", "nodes").update(privates.nodes(nodes));
		},
		/*
				$j.studio("updatePath", "digitalComm1")
				$j.studio("updatePath", "digitalComm1", 2)
				$j.studio("updatePath", "digitalComm1", undefined, "2013-01-13T08:00:00.000Z")
		*/
		updatePath: function(id, path, timestamp) {
			var pathIndex = defined(path, random([1,5]))

			var path = privates.determineLogistics($j.o("path", id, pathIndex), timestamp);

			privates.updateEdges(path, "active");
		},
		/*
				$j.studio("determineLogistics", path)
				$j.studio("determineLogistics", path, "2013-01-13T08:00:00.000Z")
		*/
		determineLogistics: function(modelPath, timestamp) {
		  if(!timestamp) {
        var timeStamp = dayjs().format();//$j.now();
      }

		  // Deprecated this with $j.simulation("distribute", 20382, 4);
			var path = [];
			$j.each(modelPath, function(i, edge) {
				var roll = $j.dice("roll", "outboundSuccess", "sides20");
				edge.success = true;
				if (roll>=(.9*20)) {
					edge.success = false;
				}
				path.push(edge);
				if(edge.success===false) {
					return false;
				}
			});

			if(!timestamp) {
        var history = $j.o("paths").history,
          logLength = history.log.push(path);
        history.map[timeStamp] = logLength-1;
      } else {
        $j.o("sim", dayjs(timestamp).year()).get(timestamp).paths.push(path);
      }

			var nodes = privates.transferLogistics(path);
			privates.updateNodes(nodes);

			return path;
		},


		/*
				$j.studio("transferLogistics", path)
				privates.transferLogistics(path);
		*/
		transferLogistics: function(path) {
			function out(o) {
				if(o.success===true) {
					return 1;
				}
				return 0;
			}
			function duds(o) {
				var type = ["biz", "it", "planned"];
				var dud = {};
				if(o.success===false) {
					var whichDud = type[random([0,3])];
					dud[whichDud] = 1;
				}

				return [dud, whichDud];
			}

			function updateNodeObj(id, edge) {
				var node = {};

				node.id=id;//edge.to;

				if(!$j.o("vis")) {
					return false;
				}
				var oldLog = $j.o("vis", "nodes").get(node.id).logistics;
				if(!oldLog.duds) {
					oldLog.duds = {
						biz:0,
						it:0,
						planned:0
					}
				}

				node.logistics = $j.methods($j.simulation("mode"), {
					single:function() {
						return $j.extend(true,
							{},
							oldLog,
							{
								duds:{
									biz:0,
									it:0,
									planned:0
								}
							},
							{
								in:1,
								out:out(edge),
								duds:duds(edge)[0]
							});
					},
					accumulate: function() {
						var whichDud = duds(edge)[1];
						var o = $j.extend(true,
							{},
							oldLog,
							{
								in:oldLog.in+1,
								out:oldLog.out+out(edge),
								duds:{
									biz:oldLog.duds.biz,
									it:oldLog.duds.it,
									planned:oldLog.duds.planned
								}
							});

						if(whichDud) {
							o.duds[whichDud] = o.duds[whichDud] + 1;
						};

						return o;
					}
				}, edge);

				return node;
			}

			var nodes = [];
			$j.each(path, function(i, edge) {
				if(i<1) {
					nodes.push(updateNodeObj(edge.from, edge));
				}
				//var node = updateNodeObj(id, edge);
				nodes.push(updateNodeObj(edge.to, edge));
				if(edge.success===false) {
					return false;
				}
			});
			return nodes;
		},
		/*
				$j.studio("updateEdges", [{...},{...},...]);
		*/
		updateEdges: function(edges, state) {
			var activeEdges = privates.activeEdges();//$j.studio("activeEdges")

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
			o.value = $j.o("vis", "nodes").get(edge.from).logistics.out;
			$j.methods(state, {
				active: function() {
					o.state = "active";
					o.color = {
						color: $j.o("color", "green_5")
						//highlight:blue
						//opacity:.3
						//inherit:'both', 'to', 'from'
					};
				},
				inactive: function() {
					o.state = "inactive";
					o.color = {
						color: $j.o("color", "white_2")
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
		},
		/*
				$j.studio("updateTimeline", dataSet, function() {

				})
		*/
		updateTimeline: function(dataSet, after) {
			var id$ = $j.o("timeline").data.update(dataSet)
			if(after) {
				return after(ids);
			}
			return ids;
		},
		/*
				$j.studio("heatColor", "reds", 3382);
		*/
		heatColor(palette, value) {
			var colors = $j.o("color", "heat")[palette];

			var ranges = $j.o("entities").ranges[palette];

			Number.prototype.between = function(min, max) {
				return ((this - min) * (this - max) <= 0);
			}

			for (var i = 0; i < ranges.length; i++) {
				if(value.between(ranges[i][0], ranges[i][1])) {
					return colors[i];
				}
			}
		}
	};

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
