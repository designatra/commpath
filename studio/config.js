var config = module.exports = {};

config.js = require("./buildables/config.js");

config.js.project = {
	name:"studio",
	less:{
		paths:["brand"]
	},
	relationships:{
		root:"/studio/",
		product:"studio",
		business:"b2e-studio",
		brand:"csaa"
	}
};

config.paths = {
	buildables:{
		project:"./studio/"
	},
	projects:"/studio"
};
