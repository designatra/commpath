/* Director > Main (document ready)
 *
 */

var $j = jQuery.noConflict();
var root = "";

$j(document).ready(function(){
	initialize();

	$j.when(
		$j.getScript("/commpath/data/dictionary.js"),
		$j.getScript("/commpath/data/network.js"),
		$j.getScript("/commpath/data/communications.js")
	)
	.then(function() {
		$j.what($j.extend(true, {}, $j.what(), {
			logistics:{},
			maps:{
				nodes:{
					by: {
						id:{}
					}
				}
			}
		}));

		// PRE-Process: ...& do some mapping
		var maps = $j.what("maps"),
			mappedNodes = maps.nodes.by.id;
		$j.each($j.o("nodes"), function(i, node) {
			mappedNodes[node.id] = node;
		});


		$j.el("papa").build("setup", {
				project:"/studio/",
				elements:[
					{
						name: "svg",
						component:true
					},
					{
						name: "inspector",
						component:true
					},
					"inspector.body",
					"inspector.failure",
					"menu",
					"wrapper",
					"p",
					"thing",
					"svg.body",
					"communications",
					"communication"
				]
			},
			function(frags) {
				$j.actors({
					after: function() {
						pageBuilder.apply($j.el("papa"));
					}
				});
			});
		});
	}
);

/*
	BREAK: end of director.core.js
*/
