// import $ from 'jquery';
// import './core/css/calibration.css';
// import trends from './data/trends/2014_weekly.1.json';
/* Director > Main (document ready)
 *
 */
// window.$j = window.jQuery = require(
//   'jquery'
// );
//
// var $j = jQuery.noConflict();
window.$j = window.$ = window.jQuery = require(
  'jquery'
);

var $j = jQuery.noConflict();
import * as dj from '../../../core/js/frame.js';
import PowerArray from '../../../core/js/powerArray.js';

require('../../../core/js/actors.js');
import sitespecific from './sitespecific.js';

import dayjs_plugin_isBetween from 'dayjs/plugin/isBetween';
import dayjs_plugin_isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import trend_1 from '../../../data/trends/2014_weekly.1.json';
import trend_2 from '../../../data/trends/2014_weekly.2.json';

var dictionary = require('../../../data/dictionary'),
	network = require('../../../data/network'),
	timeline = require('../../../data/timeline'),
	communications = require('../../../data/communications');

var root = "";

$j(document).ready(function(){
	dj.initialize();
	dayjs.extend(dayjs_plugin_isBetween);
	dayjs.extend(dayjs_plugin_isSameOrAfter);

	$j.what($j.extend(true,
		{},
		$j.what(),
		dictionary,
		network,
		timeline,
		communications,
		{
			logistics:{},
      simulation: {},
			maps:{
				nodes:{
					by: {
						id:{}
					}
				}
			},
			trends:{
				by_week:{
					since:{
						2014:[new PowerArray(trend_1), new PowerArray(trend_2)]
					}
				}
			}
		}
	));

		// PRE-Process: ...& do some mapping
		var maps = $j.what("maps"),
			mappedNodes = maps.nodes.by.id;
		$j.each($j.o("nodes"), function(i, node) {
			mappedNodes[node.id] = node;
		});

		$j.el("papa").build("setup", {
				project:"/studio/",
				elements:[
					{
						name: "svg",
						component:true
					},
					{
						name: "inspector",
						component:true
					},
					"inspector.body",
					"inspector.failure",
					"menu",
					"wrapper",
					"p",
					"thing",
					"svg.body",
					"communications",
					"communication",
					"control.path",
					"timeline"
				]
			},
			function(frags) {
				$j.actors({
					after: function(o) {
						sitespecific.pageBuilder($j.el("papa"));
					}
				});
			});
		//});
	}
);

/*
	BREAK: end of director.core.js
*/
