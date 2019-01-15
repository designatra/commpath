self.importScripts(
  "https://unpkg.com/dayjs@1.7.8/dayjs.min.js",
  "/core/js/powerArray.js",
  "/node_modules/rpg-dice-roller/dice-roller.js"
);

var plugin = {
  dice:{}
};
var objs = {
  day:function(timestamp) {
    return {
      timestamp:timestamp.toISOString(),
      paths:new PowerArray()
    }
  },
  second: function(timestamp) {
    return {
      timestamp:timestamp.toISOString(),
      path:new PowerArray()
    }
  }
}
function roll(id, format) {
  var die = plugin.dice[id];
  if(!die) {
    die = plugin.dice[id] = new DiceRoller();
  }
  die.roll(format);
  return die.log.shift().total;
}

self.onmessage = function(event) {
  var conf = event.data;

  var d = dayjs(conf.timestamp);

  var start = d.startOf(conf.period),
    end = d.endOf(conf.period);

  var map = {};
  map[start.toISOString()] = 0;

  var timestamps = new PowerArray([objs.second(start)]);

  var diceMethod = "d20";
  if(conf.intervalUnit==="second") {
    diceMethod = "2d10+4+2d20-L";
  }


  function next() {
    var nextTime = dayjs(timestamps.fromEnd(1).timestamp).add(roll("bulkEventGeneration", diceMethod), conf.intervalUnit);

    // If the next random time falls before the time periods end time
    if(!nextTime.isAfter(end)) {
      map[nextTime.toISOString()] = timestamps.push(objs.second(nextTime))-1;
      return next();
    }

    self.postMessage({map:map, timestamps:timestamps});
    // if(after) {
    //   return after();
    // }
  };
  next();
}








