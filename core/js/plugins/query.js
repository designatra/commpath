(function($j) {
	var plugin = {
		name: "query",
		methods: {},
		init: false,
		els: {},
		data: {
			loaded: {
				events: false
			}
		},
		path: "" //"http://0.0.0.0:3000/api/"  http://passport.rocks:3000/api/

	};
	plugin.methods.dom = {
		init: function(o) {
			return jQuery(this);
		},
	};

	/*
		$j.query()

		TODO: REFACTOR the shit out of this crap
	*/
	var util = plugin.methods.util = {
		init: function(x, y, z) {
			return overload(x, {
				string: function() {
					if(plugin.privates[x]) {
						return plugin.privates[x](y, z);
					}
					return plugin.privates.core()[x];
				},
				object: function() {
					return $j();
				},
				undefined: function() {
					return plugin.privates.core();
				}
			});
		}
	};

	/*
		Ideally these could created when fragment creates elements
	*/
	plugin.privates = {
		core: function() {
			return $j.what();
		},
		/*
			http://passport.rocks:3000/api/pages/6/comments/count

			$j.query("commentCount", 6, function(json) {
				$j.log(json)
			});
		*/
		/*
		commentCount: function(pageId, after) {
			return ajax({
				path:"pages/"+pageId+"/comments/count"
			}, after);
		},
		*/
		/*
			http://passport.rocks:3000/api/pages/6/likes

			$j.query("likePage", {
				pageId:6,
				profileId:2
			}, function(json) {
				$j.log(json)
			});
		*/
		/*
		likePage: function(o, after) {
			return ajax({
				type:"POST",
				path:"pages/"+o.pageId+"/likes",
				data:o
			}, function(json) {
				$j.query("pagesLiked", o.profileId, function(pages) {
					if(after) {
						return after(pages)
					}
					return pages;
				});
			});
		},
		*/
		/*
			$j.query("pages", function(json) {
				$j.fragment("page").map(json)
			})
		*/
		/*
		pages: function(after) {
			return $j.getJSON(plugin.path+"pages", function(json) {
				var pages = $j.fragment("page").map(json);

				if(after) {
					return after(pages);
				}
			});
		}
		*/
	}

	/*
		ajax({
			type:"post",
			url:"comments",
			data: {},
			after: function() {
	
			}
		})
	*/
	function ajax(o, after) {
		var params = $j.extend(true, 
			{}, 
			{
				url:plugin.path+defined(o.path, "/"),
				type:"GET"
			},
			o
		);

		$j.ajax(params)
			.done(function(json) {
				if(after) {
					return after(json);
				}
			});
	}

	// DON'T MODIFY > dollarJ (based on jQuery) plugin boilerplate
	jQuery.fn[plugin.name]=function(e){var r=plugin.methods.dom;return r[e]?r[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e&&r[e]?void jQuery.error("Method "+e+" does not exist on jQuery(el)."+plugin.name):r.init.apply(this,arguments)},jQuery[plugin.name]=function(e){jQuery.isNumeric(e)&&(e=parseInt(e));var r=plugin.methods.util;return r[e]?r[e].apply(r,Array.prototype.slice.call(arguments,1)):"object"==typeof e||!e||!r[e]||plugin.data[e]||jQuery.isNumeric(e)?r.init.apply(r,arguments):void jQuery.error("Method "+e+" does not exist on jQuery."+plugin.name)};
})(jQuery);
