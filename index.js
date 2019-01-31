// window.$ = window.jQuery = require(
//   'jquery'
// );

//var $j = jQuery.noConflict();
// window._ = window._ = require(
//   'lodash'
// );
//require("jquery");
//var $j = jQuery.noConflict();

require('./core/js/frame.js');
require('./core/js/actors.js');
require('./core/js/plugins/build.js');

// require('./core/js/powerArray.js');
require('rpg-dice-roller');

window.dayjs = require('dayjs');
// require('https://unpkg.com/dayjs@1.7.8/plugin/isBetween.js');
// require('https://unpkg.com/dayjs@1.7.8/plugin/isSameOrAfter.js');
window.accounting = require("accounting-js")

window.DataSet = require('vis/lib/DataSet');
window.Network = require('vis/lib/network/Network');
window.Timeline = require('vis/lib/timeline/Timeline');

// import 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis-network.min.css';
// import 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis-timeline-graph2d.min.css';

//require('./studio/js/dontModify/actors.js');

require('./studio/js/modify/director.core.js');
require('./studio/js/modify/sitespecific.js');
require('./studio/js/modify/el.js');
require('./studio/js/modify/o.js');
require('./studio/js/modify/studio.js');
require('./studio/js/modify/dice.js');
require('./studio/js/modify/simulation.js');

import './core/css/calibration.css';
import './studio/css/modify/fragments.css';
import './studio/css/modify/sitespecific.css';


import trends from './data/trends/2014_weekly.1.json';

// async function getComponent() {
//   var element = document.createElement('div');
//   const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');
//
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//
//   return element;
// }
//
// getComponent().then(component => {
//   document.body.appendChild(component);
// });
