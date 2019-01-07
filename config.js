module.exports  = {
	// js: require("/buildables/config.js"),
	paths:{
		core:{
			path:"./core/",
			js:"./core/js/",
			plugins:"./core/js/plugins/"
		},
		// This should probably be an array since order is important
		buildables:{
			brand:"./buildables/brands/",
			biz:"./buildables/businesses/",
			product:"./buildables/products/"
			// project:"./studio/",
		},
		// projects:"/studio",
		styles:{
			brand:"",
			businesses:"",
			products:""
		},
		output:{
			file:"build.json"
		},
		search:{
			// used to store the four buildable paths that will be searched when looking for an element
			scope: {
				element:false,
				component: false
			} 			// array of scope paths replaces boolean (only configure once)
		}
	}
};
