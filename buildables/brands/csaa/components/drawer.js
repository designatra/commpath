$j.build("component")["drawer"] = {
	/*
		COMPONENT: "drawer"

		$el.build("drawer")
		.build("drawer", {expanded:true},

		RETURNS: drawer > body
	*/
	build: function(data, config) {
		var $return;

		$j(this).build("drawer", defined(data, 1), {
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
				var $drawer = $j(this);

				// SETTING UP ACTION and BLOCK for drawer
				// NOTE: if drawers get attached to other types of elements....
				var $col3 = $drawer
					.closest("action").attr("drawer", "collapsed")
					.find("> block > wrapper > wrapper:nth-child(3) action");

				// $col3
				// 	.children("svg:last").empty()
				// 	.end()
				// 	.build("wrapper", {
				// 		type:"icon_morph"
				// 	}, function() {
				// 		$j(this).addLiviconEvo({
				// 			name: "morph-chevron-top-bottom.svg",
				// 			strokeStyle: "round",
				// 			strokeWidth: "2",
				// 			flipVertical: true,
				// 			eventType: "none",
				// 			duration: "0.2",
				// 			drawColor: "#333333"
				// 		});
				// 	})


				if(config.after) {
					config.after.apply($drawer, arguments);
				}

				$j.build("component").drawer.events.default.apply($j(this), [o]);

				if(o && o.expanded && o.expanded === true) {
					$j(this).trigger("expand.drawer");
				}

				return getBody($drawer);
			},
			completed: function(o) {
				var $drawer = $j(this);

				if(config.completed) {
					config.completed.apply($j(this), arguments);
				}

				return $return = getBody($drawer);
			}
		});

		function getBody($el) {
			return $el
				.children("wrapper")
				.children("wrapper#body");
		}

		return $return;
	},
	secondary: {
		/*
			$el.build("drawer.secondary")

			RETURNS:drawer + drawer > body > group > header, body, footer
		*/
		build: function(data, config) {
			$j(this).children("action:first").attr("drawer_2", "collapsed");

			var $group =  $j(this)
				.build("drawer", {
					type:"secondary"
				})
				.find(">wrapper>#body").build("group");


			// var $drawer2 = $j(this).children("drawer[type=secondary]")
			// $drawer2.css({
			// 	marginTop:-$drawer2.outerHeight()
			// })

			$j.build("component").drawer.events.secondary.apply($group.closest("drawer"), [data, config]);

			return $group;
		}
	},
	/*
		$j.build("component")["drawer.block"].events.________.apply($j(this), [o]);
	*/
	events: {
		default: function() {
			var animation = {
				duration:350,
				easing:[125,20]
			};

			$j(this).closest("action")
				.on({
					"toggle.drawer": function(e) {
						var $action = $j(this),
							$drawer = $j(this).children("drawer");

						var event = {};
						event.type = "expand.drawer"
						// IF drop down items are visible
						if($action.is("[drawer=expanded")) {
							// THEN they need to be hidden (collapsed)
							event.type = "collapse.drawer";
						}

						return $action.trigger(event);
					},
					"expand.drawer": function(e) {
						var $action = $j(this),
							$drawer = $j(this).children("drawer");

						$action.attr("drawer", "expanded");

						$j.build("component").drawer.motion.primary.expand($drawer);
					},
					"collapse.drawer": function(e, opts) {
						var $action = $j(this),
							$drawer = $j(this).children("drawer");

						// var duration = animation.duration;
						// if(opts && opts.animation===false) {
						// 	duration = 0;
						// }
						$action.attr("drawer", "col");
						$j.build("component").drawer.motion.primary.collapse($drawer);

						// $drawer.velocity(
						// 	{
						// 		marginTop:-1*$drawer.outerHeight()
						// 	},
						// 	{
						// 		duration:duration,
						// 		easing:animation.easing,
						// 		begin: function() {
						// 			var $col3 = $action.find("> block > wrapper > wrapper:nth-child(3) action");
						// 			//$col3.children("[type=icon_morph]").playLiviconEvo()
						// 			var duration = 200;
						// 			if($action.find("> block").is("[cancel=true]")) {
						// 				duration = 0;
						// 			}
						// 			$col3.children("svg").velocity({
						// 				rotateZ: "-90deg",
						// 				rotateY:"-180deg"
						// 			}, duration)
						// 			$action.attr("drawer", "collapsed");
						// 		},
						// 		complete: function() {
						// 			//$action.attr("drawer", "collapsed");
						// 		},
						// 		display:"none"
						// 	});
					}
				})
				// NOTE > This will prob need to be disabled for secondary drawer
				.on({
					click: function(e) {
						var $block = $j(this);
						$j.throttle("clickActionBlockDrawer", e, 300, function() {
							$block.trigger({
								type:"toggle.drawer"
							});
						});
					}
				}, "block > wrapper");

			// Setup action > drawer in the correct state utilizing the state initially stored on the action
			// TODO: Need to be able to apply event without animation
			var $action = $j(this).closest("action");
			if($action.is("[drawer=collapsed]")) {
				$action.trigger("collapse.drawer", {
					animation:false
				});
			}

		},
		secondary: function() {
			/*
			var tl = new TimelineLite();

			tl.set($drawer2, {
				height:"auto",
				display:"block",
				zIndex:1
			});

			tl.from($drawer2, .15, {
				height:0,
				onReverseComplete:function() {

				}
			})

			tl.fromTo($drawer2,
				0.2,
				{
					z:-650,
					y:-10,
					rotationX:"-15deg"
				},
				{
					z:3,
					y:0,
					rotationX:0,//
					ease: Power3.easeOut
				},
				"-=.15"
			);
			tl.set($drawer2, {
				zIndex:100
			})
			tl.to($drawer2, .1, {
				y:-$action.find(">drawer>wrapper>#footer").height(),
				z:0,
				ease: Power1.easeOut,
				onStart: function() {
					$drawer2
					//.css({
					//	zIndex:100
					//})
						.prev().attr("drawer_2", "expanded")
				}
			});
			*/

			$j(this)
				.on({
					"toggle": function() {
						var $action = $j(this).prev("action");
						if($action.is("[drawer_2=expanded]")) {
							return $j(this).trigger("collapse");
						}
						return $j(this).trigger("expand");
					},
					"expand": function() {
						var $drawer2 = $j(this);
						//var $action = $drawer2.prev("action");

						$j.build("component").drawer.motion.secondary.expand($drawer2);
						/*
						var animation = [
							{
								e:$j(this),
								p:"slideDown",
								o:{
									easing: "easeOut",//[125, 20],
									duration:75
								}
							},
							{
								e:$j(this),
								p:{
									zIndex:[100,1],
									translateZ:[3, -650],
									rotateX:[0, "-15deg"]
								},
								o:{
									delay:-50,
									easing: "easeOut",//[125, 20],
									sequenceQueue:false,
									duration:150
								}
							},
							{
								e:$j(this),
								p:{
									translateY:-$action.find(">drawer>wrapper>#footer").height(),
									translateZ:0
								},
								o:{
									delay:-125,
									easing: "easeOut",//[125, 20],
									duration:100,
									begin: function() {
										$action.attr("drawer_2", "expanded");
										$j(this).css({
											zIndex:100
										});
									}
								}
							}
						];

						$j.Velocity.RunSequence(animation);
						*/

					},
					"collapse": function() {
						var $drawer2 = $j(this);
						//var $action = $drawer2.prev("action");

						$j.build("component").drawer.motion.secondary.collapse($drawer2);
						/*
						var $action = $j(this).prev("action");

						var animation = [
							{
								e:$j(this),
								p:{
									translateY:[0,-$action.find(">drawer>wrapper>#footer").height()],
									translateZ:[3,0]
								},
								o:{
									easing: "easeOut",//[125, 20],
									duration:100,
									begin: function() {
										$action.attr("drawer_2", "collapsed");
									}
								}
							},
							{
								e:$j(this),
								p:{
									zIndex:1,
									translateZ:-650,
									rotateX:"-15deg"
								},
								o:{
									delay:-100,
									easing: "easeIn",//[125, 20],
									duration:150,
									begin: function() {
										$j(this).css({
											zIndex:1
										});
									}
								}
							},
							{
								e:$j(this),
								p:"slideUp",
								o:{
									easing: "easeOut",//[125, 20],
									duration:150,
									sequenceQueue:false
								}
							}
						];

						$j.Velocity.RunSequence(animation);
						*/

					}
				});
		}
	},
	motion: {
		primary:{
			init_v1: function($drawer, callback) {
				/*
				var $action = $drawer.prev();

				var motion = $drawer.data("motion", {
						timeline: new TimelineLite({
							paused: true,
							reversed:true
						})
					})
					.data("motion");

				TweenLite.set($drawer, {
					height:0,
					autoAlpha: 0,
					display: "none"
				});

				var tl = motion.timeline;

				tl.to($drawer, .35, {
					height:"auto",
					autoAlpha:1,
					display:"block",
					ease: Cubic.easeInOut,
					overwrite: "none"
				});

				if(callback) {
					return callback($drawer)
				}
				*/
			},
			init: function($drawer, callback) {
				/*
				var $action = $drawer.prev();

				console.log($drawer, $drawer.height(), $drawer.outerHeight())
				TweenLite.set($drawer, {
					//height:0,
					y:-$drawer.children().height(),
					autoAlpha: 0
					// display: "none"
				});

				var motion = $drawer.data("motion", {
					timeline: new TimelineLite({
						paused: true
						//reversed:true
					})
				}).data("motion");

				var tl = motion.timeline;

				tl.to($drawer, 5, {
					//height:"auto",
					autoAlpha:1,
					// display:"block",
					overwrite: "none",
					y:0,
					ease:Power2.easeOut
				});

				if(callback) {
					return callback($drawer)
				}
				*/
			},
			/*
				$j.build("component").drawer.motion.primary.expand($drawer);
			*/
			expand: function($drawer) {
				// var motion = $drawer.data("motion");
				//if(!motion) {
				//	return this.init($drawer, this.expand);
				//	}

				var $action = $drawer.parent();

				TweenMax.set($drawer, {
					height:0,
					marginTop:-$drawer.height()
				});
				TweenMax.to($drawer, .35, {
					height:"auto",
					marginTop:0,
					ease:Power1.easeOut,
					onStart: function() {
						var $col3 = $action.find("> block > wrapper > wrapper:nth-child(3) action");

						var duration = .35;
						if($action.find("> block").is("[cancel=true]")) {
							duration = 0;
						}

						TweenMax.to($col3.children("svg"), duration, {
							rotationZ:-90,
							rotationY:0
						})
					}
				})


				// if(motion.timeline.reversed()) {
				// 	motion.timeline.play();
				// }else {
				// 	motion.timeline.reverse();
				// }


				// TweenLite.set($action, {
				// 	overflow:"hidden"
				// });

				// TweenLite.set($drawer, {
				// 	height: "auto",
				// 	display:"block"
				// 	//overflow:"hidden"
				// });

				// motion = $drawer
				// 	.data("motion", {
				// 		timeline: new TimelineLite({
				// 			paused: true,
				// 			reversed:true
				// 		})
				// 	})
				// 	.data("motion");



				// var animation = {
				// 	duration:350,
				// 	easing:[125,20]
				// };
				//
				// $drawer.velocity(
				// 	{
				// 		marginTop:-1
				// 	},
				// 	{
				// 		duration:animation.duration,
				// 		easing:animation.easing,
				// 		begin: function() {
				// 			var $col3 = $action.find("> block > wrapper > wrapper:nth-child(3) action");
				// 			$col3.children("label").text("cancel")
				// 			$col3.children("svg").velocity({
				// 				rotateZ: "-90deg",
				// 				rotateY:"0deg"
				// 			}, 200)
				// 		},
				// 		display:"block"
				// 	});

				//var tl = motion.timeline;
				// tl.to($drawer, 0.35, {
				// 	//height:0,
				// 	marginTop:-1,
				// 	ease: Power1.easeOut,
				// 	onStart: function() {
				// 		$action.attr("drawer_1", "expanded");
				//
				// 	},
				// 	onReverseComplete: function() {
				// 		$action.attr("drawer_1", "collapsed");
				// 		// TweenLite.set($action, {
				// 		// 	overflow:"visible"
				// 		// });
				// 	}
				// });
			},
			collapse: function($drawer) {
				//motion.timeline.reverse();
				//$drawer.data("motion").timeline.reverse();
				var $action = $drawer.parent();

				TweenMax.to($drawer, .35, {
					marginTop:-$drawer.height(),
					ease:Power1.easeOut,
					onStart: function() {
						var $col3 = $action.find("> block > wrapper > wrapper:nth-child(3) action");

						var duration = .35;
						if($action.find("> block").is("[cancel=true]")) {
							duration = 0;
						}

						TweenMax.to($col3.children("svg"), duration, {
							rotationZ:-90,
							rotationY:-180
						})
					}
				})

			}
		},
		secondary:{
			/*
				$j.build("component").drawer.motion.secondary.expand($drawer);
			*/
			expand: function($drawer) {
				var motion = $drawer.data("motion");
				if(motion) {
					return motion.timeline.restart();
				}

				var $action = $drawer.prev();
				TweenLite.set($drawer, {
					height: "auto",
					display:"block"
				});

				motion = $drawer
					.data("motion", {
						timeline: new TimelineLite()
					})
					.data("motion");

				var tl = motion.timeline;
				tl.from($drawer, 0.15, {
					height:0
				});

				tl.fromTo($drawer,
					0.2,
					{
						z:-650,
						y:-10,
						rotationX:"-15deg"
					},
					{
						z:3,
						y:0,
						rotationX:0,//
						ease: Power3.easeOut
					},
					"-=.15"
				);

				tl.set($drawer, {
					zIndex:100
				});

				tl.to($drawer, .1, {
					marginTop:-$action.find(">drawer>wrapper>#footer").height(),
					z:0,
					ease: Power1.easeOut,
					onStart: function() {
						$action.attr("drawer_2", "expanded");
					},
					onReverseComplete: function() {
						$action.attr("drawer_2", "collapsed");
					}
				});

				return tl;
			},
			/*
				$j.build("component").drawer.motion.secondary.collapse($drawer);
			*/
			collapse: function($drawer) {
				$drawer.data("motion").timeline.reverse();
			}
		}
	}
};

// $j.Velocity
// 	.RegisterEffect("drawer.secondary.show", {
// 		defaultDuration: 700,
// 		calls: [
// 			[
// 				[
// 					{
// 						zIndex:[100,1],
// 						translateZ:[2, -650],
// 						rotateX:[0, "-10deg"]
// 					},
// 					0.7,
// 					{
// 						easing: [125, 20]
// 					}
// 				],
// 				[
// 					{
// 						translateY:[-64, 0]
// 					},
// 					0.3,
// 					{
// 						easing: [125, 20]
// 					}
// 				]
// 			]
// 		]
// 	});