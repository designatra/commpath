/* Director > Main (document ready)
 *
 */

var $j = jQuery.noConflict();
var root = "";

$j(document).ready(function(){
	initialize();

	// $j.what({
	// 	initaldata:{
  //
	// 	}
	// });

	$j.when(
		//$j.getScript("/buildables/inventory.js"),
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

		/*
			V3 > Project and Product Data
		*/
		// var productData = $j.what("products"),
		// 	defaults = productData.defaults,
		// 	products = productData.inventory,
		// 	projects = $j.what("projects");


		$j.el("papa").build("setup", {
				project:"/studio/",
				elements:[
					// {
					// 	name: "panel",
					// 	component:true
					// },
					// {
					// 	name: "card",
					// 	component:true
					// },
					"menu",
					"wrapper",
					"p",
					"thing",
					"item",
					"tabs",
					"tab"
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
