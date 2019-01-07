// var watch = module.exports = {};

// var $j = require(config.paths.core.js+"node/frame.js");
var config = require("./config");

var utils = {
	watcher: require("chokidar"),
	path: require("path"),
	build:require("./build")
};

// TODO: This function is pretty lame
var watch = {
	forChanges:function() {
		var path = config.paths.buildables,
			project = config.js.project,
			rel = project.relationships,
			projectPath = utils.path.join(path.project, rel.brand, rel.business, rel.product, project.name, project.version);

		return utils.watcher
			.watch([utils.path.join(projectPath, "buildables")+"/.", path.product+".", path.biz+".", path.brand+"."], {
				ignored: [
					/(^|[\/\\])\../,
					utils.path.join(projectPath, "buildables", "build.json")
				]
			})
			.on("change", (path) => {
				console.log("CHANGE", path);

				// config.js.elements
				utils.build("file", config);
			});
	}
};

watch.forChanges();
