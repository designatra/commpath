module.exports = function(exportType, config, callback) {
	var app= {};
	app.utils = {
		path: require("path"),
		fs: require("fs"),
		jsdom: require("jsdom"),					// https://github.com/tmpvar/jsdom
		less: require("less")
	};

	app.config = config;
	app.project = config.js.project;

	app.out = {
		elements:{},
		packages:{},
		components:{},
		styles:[]
	};

	var $j = require(config.paths.core.js+"node/frame.js"),
		_ = require("lodash");

	app.scripts = {
		jquery: app.utils.fs.readFileSync(app.utils.path.join("./", config.paths.core.js, "jquery.js"), "utf-8")
	};

	var get = {
		stylesheets: function(stylesheets) {
			_.forEach(stylesheets, function(dir, sheets) {

			});
		},
		scripts: function(scripts) {

		},
		elements: function(elements) {
			app.count = {
				elements:{
					total:config.js.elements.length,
					loaded:0
				},
				packages:0,
				components:0
			}
			_.forEach(elements, function(element) {
				var el = $j.overload(element, {
					string: function() {
						return {
							name:element
						}
					},
					object: function() {
						return element;
					}
				});

				get.element(el);
			});
		},
		/*
			Search for closest element
		 	Pass closest element's path to html
		 */
		element: function(element) {
			get.html(find.element(element), function(el, html) {
				app.out.elements[el.name] = html;

				var count = app.count.elements;
				count.loaded++;
				if(count.loaded>=count.total) {

					var renderOptions = {
						paths:["core/css/layout"],
						compress:true,
					};
					return app.utils.less.render(app.out.styles.join("\n\n")+";", renderOptions, function(e, output) {
						if(e && e!=null) {
							console.log(e)
						}


						// if(after) {
						// 	return after(output)
						// }
						app.out.styles = "<style id='' type='text/css'>"+output.css+"</style>";
						return got.everything(app.out)
						//return output;


					});

					// TODO: NO Idea (maybe something to do with how less processes)
					// setTimeout(function() {
					// 	$j.log("GOT EVERYTHING")
					// 	return got.everything(app.out)
					// }, 300);
				}

				if(el.packages && el.packages.length>0) {
					get.packages(element);
				}

				$j.overload(el.component, {
					boolean: function() {
						get.components(element);
					},
					array: function() {

					},
					undefined: function() {

					}
				});
			});
		},
		packages: function(element) {
			var output = app.out.elements[element.name].packages = {};
			_.forEach(element.packages, function(package) {
				output[package] = app.utils.fs.readFileSync(find.package(element.name, package).path, "utf-8");
			});
		},
		components: function(element) {
			var fileContent;
			try {
				fileContent = app.utils.fs.readFileSync(find.component(element.name).path, "utf-8");
			} catch (err) {
				fileContent = true;
			}
			app.out.elements[element.name].component = fileContent;
		},
		html: function(element, after) {
			app.utils.jsdom.env({
				file:"./"+element.path,
				src:[app.scripts.jquery],
				done: function(err, window) {
					if(err) {
						return after(element, {
							style:"",
							html:""
						});
					}

					var paths = config.paths.buildables,
						js = config.js,
						rel = js.project.relationships;

					var projectStylePath = $j.methods(js.project.name, {
						studio: function() {
							return app.utils.path.join(paths.project, "css", "styles");
						},
						def: function() {
							// Project styles import styles that begin the tiered inheritance climb
							return app.utils.path.join(paths.project, rel.brand, rel.business, rel.product, js.project.name, js.project.version, "css", "styles");
						}
					});

					var jQuery = window.$;
					var styles = "@import '"+projectStylePath+"'; " + jQuery("style").text();

					app.out.styles.push(styles)
					return renderLess(styles, function(output) {
						// var out = output,
						// 	css;

						// if(out) {
						// 	css = out.css;
						// 	if(!css) {
						// 		css = "";
						// 	}
						// } else {
						// 	css = "";
						// }

						return after(element, {
							//style: "<style id='"+element.name+"' type='text/css'>"+output.css+"</style>",
							html: jQuery("body").html()
						});
					});
				}
			});

			function renderLess(css, after) {
				/*
				paths 	> > > > > > 	product: './buildables/products/',
									biz: './buildables/businesses/',
									brand: './buildables/brands/',
									project: './projects/' 
				*/
				var paths = config.paths.buildables;

				/*
				config.js.project >   name: 'otsp',
									version: 'v1',
									relationships: { 
										product: 'insurancePortal', 
										business: 'b2b', 
										brand: 'csaa' 
									}
				*/
				var js = config.js,
					rel = js.project.relationships;

				//TODO: LESS search paths need to account for where the element lives (I think?)
				var renderOptions = {	
					paths:["core/css/layout"],
					compress:true,
				};

				var lessPaths = {
					//>>buildables/brands/csaa
					brand:app.utils.path.join(paths.brand, $j.defined(rel.brand, "")), 
					//>>buildables/businesses/b2b
					business:app.utils.path.join(paths.biz, $j.defined(rel.business, "")),
					//>>buildables/products/insurancePortal
					product:app.utils.path.join(paths.product, $j.defined(rel.product, "")),
					//>>projects/csaa/b2b/insurancePortal/otsp/v1
					project:app.utils.path.join(paths.project, $j.defined(rel.brand, ""), $j.defined(rel.business, ""), $j.defined(rel.product, ""), $j.defined(js.project.name, ""), $j.defined(js.project.version, ""), "css")
				};
				
				if(js.project.less.paths){
					_.forEach(js.project.less.paths, function(name) {
						renderOptions.paths.push(app.utils.path.join(lessPaths[name], "styles"));
					});
				}
				renderOptions.filename = app.utils.path.resolve("loader");
				app.utils.less.render(css.toString(), renderOptions, function(e, output) {
					if(e && e!=null) {
						console.log(e)
					}

					if(after) {
						return after(output)
					}
				});
			}
		}
	};

	var got = {
		everything: function(output) {
			var path = app.utils.path.join(config.paths.search.scope.element[0], "..", config.paths.output.file);

			return $j.methods(exportType, {
				file: function() {
					// https://www.npmjs.com/package/jsonfile 
					app.utils.json = require("jsonfile");
					return app.utils.json.writeFile(path, output, function (err) {
						if(err===null) {
							return console.log("CREATED NEW > "+path);
						}
						return console.error("ERROR > ", err);
					});
				},
				http:function() {
					if(callback) {
						return callback(output);
					}
				}
			});
		}
	};

	/*
		TODO: Horidness
	*/
	var find = {
		element: function(element) {
			return this.buildable(element, "element");
		},
		package: function(elementName, packageName) {
			return this.buildable({
				name: elementName+"."+packageName
			}, "package");
		},
		component: function(elementName) {
			return this.buildable({
				name:elementName
			}, "component");
		},
		buildable: function(element, type) {
			var searchScope = config.paths.search.scope[type];

			if(searchScope===false) {
				searchScope = create.searchScope(type);
			} 

			if(type=="package") {
				// Packages look in the elements directory so utilize same scope
				searchScope = config.paths.search.scope.element;
			};

			var ext = $j.methods(type, {
				element:function() {
					return ".html";
				},
				package: function() {
					return ".js";
				},
				component: function() {
					return ".js";
				}
			});

			var useThisPath;
			_.forEach(searchScope, function(path) {
				var constructedPath = app.utils.path.join("./", path, element.name+ext)

				if (app.utils.fs.existsSync(constructedPath)) {
					useThisPath = constructedPath;
					//return false;
				}
			});

			element.path = useThisPath;
			return element;
		}
	}

	var create = {
		searchScope: function(buildableType) {
			var project = app.project,
				rel = project.relationships;

			var type = $j.defined(buildableType, "element")+"s",
				scopeType = buildableType;

			if(config.paths.search.scope[scopeType]) {
				return config.paths.search.scope[scopeType];
			}
			// create array of builable paths
			config.paths.search.scope[scopeType] = [];
			// TODO: Looping through object so assuming order will remain consistent (should be an array)
			_.forEach(config.paths.buildables, function(base, id) {
				config.paths.search.scope[scopeType].push($j.methods(id, {
					// 1. brand:"./buildables/brands/csaa/"
					brand: function() {
						return app.utils.path.join(base, $j.defined(rel.brand, ""), type)
					},
					// 2. biz:"./buildables/businesses/"
					biz: function() {
						return app.utils.path.join(base, $j.defined(rel.business, ""), type)
					},
					// 3. product:"./buildables/products/"
					product: function() {
						return app.utils.path.join(base, $j.defined(rel.product, ""), type);
					},
					// 4. projects/brand/biz.product.project/v1/buildables
					project:function() {
						//TODO: hack to make work for studio...fix
						if(rel.root) {
							return app.utils.path.join(base, "buildables", type)
						}
						return app.utils.path.join(base, $j.defined(rel.brand, ""), $j.defined(rel.business, ""), $j.defined(rel.product, ""), $j.defined(project.name,""), $j.defined(project.version, ""), "buildables", type);
					}
				}));
			});

			return config.paths.search.scope[scopeType];
		}
	}

	/*
		Init Run Scripting
	*/
	// watch.forChanges();
	return get.elements(config.js.elements);
}


