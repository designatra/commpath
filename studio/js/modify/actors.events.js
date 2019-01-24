/*
	supports plugin > actors.js

	Event registery holding events that possibly get bound to a chained $j(this)

	$j(this).actors({
		type:"links"
	});
*/
$j.actors("register", {
	network: function(e) {
		var $inspector = $j(this);

		$j.what("network").network.on("click", function (e) {
			var node = $j.o("node", this.getNodeAt(e.pointer.DOM));

			var entity = node.entity;
			if(!entity) {
				return false;
			}

			var application = $j.o("application", entity.id);

			$inspector.build("inspector.content", {
				title:application,
				logistics:node.logistics
			})
		});
	},
	timeline: function(e) {
		var t = $j.o("timeline"),
				timeline = t.timeline;
		var weeks = {};

		timeline.on("rangechanged", function (e) {
			$j.throttle("buildingPaths", e, 400, function() {
				var calcs = {
					failure:0,
					success:0
				};

				var visibleItems = timeline.getVisibleItems();

				visibleItems.forEach(function(itemID) {
					var item = t.data.get(itemID);
					calcs[item.group] = calcs[item.group] + parseInt(item.content);
				});

				populateNetwork(calcs.success, calcs.failure);

				// TODO: SUPER SLOPPY if it works
				$j("#paths control.active").trigger("activate");
			})
		});
	},
	simulation:function(e) {
		$j(this).on({
			click: function() {
				$j(this).trigger($j(this).attr("id"));
			},
			play: function() {
				$j.simulation("mode", "accumulate")
				$j.simulation("start", "eventInterval1", function() {
					$j.studio("updatePath", "digitalComm1")
				});
			},
			stop: function() {
				$j.simulation("stop", "eventInterval1")
			},
			reset: function() {
				$j.studio("resetNodes");
			}
		}, "action")
	},
	filterPaths: function(e) {
		var $paths = $j(this);

		$paths.on({
			click: function(e) {
				if($j(this).is(".active")) {
					return false;
				}
				$j(this).trigger("activate");
			},
			activate: function() {
				var id = $j(this).klass("swap", "active").attr("id")*1;
				$j.studio("updateEdges", $j.o("path", "digitalComm1", $j(this).attr("id")*1), "active")

				var nodes = $j.o("vis", "nodes");
				var history = $j.what("history")[id];

				$j.studio("resetNetwork");

				var edge = [];
				$j.each(history.Good, function(id, logistics) {
					var thisNode = nodes.get(id),
						thisLogistics = thisNode.logistics;

					// CRY ME A RIVER :(((
					thisLogistics.in = logistics.in + history.Bad[id].in;
					thisLogistics.out = logistics.out + history.Bad[id].out;

					thisLogistics.duds.biz = logistics.duds.biz + history.Bad[id].duds.biz;
					thisLogistics.duds.it = logistics.duds.it + history.Bad[id].duds.it;
					thisLogistics.duds.planned = logistics.duds.planned + history.Bad[id].duds.planned;

					$j.studio("updateNodes", [thisNode]);

					edge.push(id);
					if(edge.length===2) {
						$j.o("vis", "edges").update({
							id:"edge"+edge[0]+"_"+edge[1],
							state:"active",
							color: {
								color: $j.o("color", "green_5")
							},
							value:thisLogistics.in
						})
						edge = [edge[1]];
					}
				});
			}
		}, "control[type=path]")
	}
});
