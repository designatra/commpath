$j.build("component").page = {
	/*
		COMPONENT: "page"

		NOTE: NOT ANYMORE > Will auto build <pages>
		NOTE: Build one page at a time if possible (logic for building multiple pages but still queezy on that)


		$el.build("page", {
			name:"edit_email"
		});
		>>> RETURNS > $page > wrapper


		$el.build("page", {
			name:"edit_email",
		//	header:{
		//		title:""
		//	}
		});

		>> RETURNS "> wrapper > wrapper#body"
	*/
	build: function(data, config) {
		var $pages = $j(this),//.build("pages"),
			$allPages=$pages.find("page");
		/*
			NOTE: 
			Manually Iterating because we need to analyze each page built so we don't accidently build 
			multiple pages (build function doesn't support cancelling mid build)
		*/
		var $returnPage;
		$j.each(data, function(i, page){
			var $page = $allPages.filter("[name="+page.name+"]");
			if($page.length<1) {
				$page = $pages.build("page", page, {
					after: function(i, o) {
						$returnPage = $j(this).find("> wrapper > wrapper#body");
						if(config.after) {
							// NOTE: Since cards have header content handled by component, the card body element is being returned instead					
							config.after.apply($returnPage, arguments);
						}

						$j.build("component").page.events.default.apply($j(this), [o]);
					}
				});
			}

			$returnPage = $page;
		});

		$returnPage.trigger("activate.page");

		return $returnPage//.find("> wrapper > wrapper#body");
	},
	events: {
		// $j.build("component").pages.events.default.apply($j(this), [o]);
		default: function() {
			$j(this).on({
				"activate.page": function(e) {
					$j(this)
						.attr("active", true)
						.siblings("[active=true]").trigger("deactivate.page");

					return $j(this);
				},
				"deactivate.page": function(e) {
					$j(this).attr("active", false);
				}
			});
		}
	}
};
