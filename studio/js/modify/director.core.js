/* Director > Main (document ready)
 *
 */

var $j = jQuery.noConflict();
var root = "";

$j(document).ready(function(){
	initialize();

	$j.what({
		paths:{

		}
	});

	$j.when(
		// $j.getScript("data/dpl.js"),
		//$j.getScript("/buildables/inventory.js"),
		// $j.getScript("/projects/products.js"),
		// $j.getScript("/projects/projects.v3.js"),
		// $j.getScript("data/documentation.js")
	)
	.then(function() {
		$j.what($j.extend(true, {}, $j.what(), {
			buildables:{
				inventory:{},
				by:{
					category:{},
					pattern:{},
					tag:{}
				}
			}
		}));

		var buildables = $j.what("buildables"),
			by = buildables.by;
		// TODO: Should have ref to each inventory item and not copies (this will cause problems)
		$j.each(buildables.inventory, function(id, buildable) {
			buildable.id = id;
			var meta = buildable.meta;
		});

		/*
			V3 > Project and Product Data
		*/
		var productData = $j.what("products"),
			defaults = productData.defaults,
			products = productData.inventory,
			projects = $j.what("projects");


		$j.el("papa").build("setup", {
				project:"/studio/",
				elements:[
					{
						name: "panel",
						component:true
					},
					{
						name: "card",
						component:true
					},
					"menu",
					"wrapper",
					"p",
					"thing",
					"item",
					"tabs",
					"tab",
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
