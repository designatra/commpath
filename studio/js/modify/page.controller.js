/*
	goTo("product");
*/

function goTo(link, el) {
	if(!link) {
		return false;
	}

	var pages = {
		all: {
			before: function() {

			},
			after: function() {
				
			}
		},
		// The following are all top level analysis controls. Since the code sucks right now
		// they work very non abstractly.
		productAssociations: function() {
			
		},
		dressingRoom: function() {

		},
		pathAnalysis: function() {

		},
		deadzone: function() {

		},
		restock: function() {

		},
		def: function() {

		}
	};

	//var el = $j("pages").find("page#"+link);
	var page = pages[link];
	if(!page) {
		page = pages.def;
	}

	pages.all.before.apply(el);
	page.apply(el);
	pages.all.after.apply(el);

	return el;
};

