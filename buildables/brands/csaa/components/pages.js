//var router;
$j.build("component").pages = {
	/*
		COMPONENT: "pages"

		$el.build("pages");

		>> RETURNS "> wrapper"
	*/
	build: function(data, config) {
		// TODO: move pages building to pages component
		var $pages = $j(this);
		if(!$j(this).is("pages")) {
			$pages = $j(this).find("pages");
			if($pages.length===0) {
				$j.what("pages", {});
				$pages = $j(this).build("pages", data, {
					events: function() {
						if(config.events) {
							return config.events;
						}
					},
					populate: function(i, o) {
						if(config.populate) {
							return config.populate.apply($j(this), arguments);
						}
					},
					after: function(i, o) {
						$j.log($j(this), o)
						if(config.after) {
							// NOTE: Since cards have header content handled by component, the card body element is being returned instead					
							config.after.apply($body, arguments);
						}

						$j.build("component").pages.events.default.apply($j(this), [o]);
					},
					completed: function(o) {
						// NOTE: Not sure why this isn't working
						// $j.what("router", new Navigo());

						if(config.completed) {
							config.completed.apply($j(this), arguments);
						}
					}
				});
			}
		}
		return $pages.children("wrapper");
	},
	events: {
		// $j.build("component").pages.events.default.apply($j(this), [o]);
		default: function() {
			$j(this).on({
				/*
					$j(pages).trigger({
						type:"goto.page",
						page:{
							name:"edit_email"
						}
					});
				*/
				"goto.page": function(e) {
					var page = e.page;
					if(!page) {
						return false;
					}
					return $j(this)
						.find("page").filter("[name="+page.name+"]")
						.trigger({
							type: "activate.page",
							page: page
						});
				}
			});
		}
	}
};
