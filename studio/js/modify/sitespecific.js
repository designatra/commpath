function pageBuilder() {
  $j(this).build("inspector");

  // $j(this).build("communications", function(i, data) {
  //   $j(this).find("> wrapper > wrapper").build("communication", $j.o("communications"))
  // })

  var $simulationControls = $j.el("papa")
    .find("#simulationControls")
    .actors({
      type:"simulation"
    });

  buildPathSelector($simulationControls, "digitalComm1");

  buildNetwork(function() {
    buildTimeline();
  });

}

function buildPathSelector($paths, modelPathID) {
  var $el = $paths
    .children("#paths")
    .build("control.path", $j.o("path", modelPathID), {
      populate: function(i, data) {
        var id = i+1;
        var o = {
          id:id,
          label:"Path: " + id,
          paths:data
        };
        return o;
      },
      completed: function(o) {
       o.$parent.actors({
         type:"filterPaths"
       })
      }
    });
}

function buildTimeline(after) {
  var container = $j.el("timeline")[0];

  var weekOf = $j.what("weekOf", {});
  var dataSet = [];
  var trend = $j.o("trends", "week", 2014);
  trend[0].forEach(function(week, i) {
    if(!weekOf[week[0]]) {
      weekOf[week[0]] = true;

      var end = dayjs(week[0]).endOf("week").format("YYYY-MM-DD");
      // Success
      var successValue = scaleUp(week[2]);
      var heatColor = $j.studio("heatColor", successValue);
      dataSet.push({
        id: guid(),
        start: week[0],
        end: end,
        content: successValue.toString(),
        value: successValue,
        heat:heatColor,
        className:"hex_"+heatColor,
        group: "success"
      });

      var week_alt = trend[1][i];
      var failureValue = (week_alt[1] * random([67, 71]));
      // Failure
      dataSet.push({
        id: guid(),
        start: week[0],
        end: end,
        content: failureValue.toString(),
        value:failureValue,
        group: "failure"
      })
    }
  });

  function scaleUp(eventTotal) {
    if(isNaN(eventTotal)) {
      var eventTotal = random([0,4])
    }
    var scaledValue = (eventTotal*1)*random([283,286]);

    return scaledValue;
  }

  var groups = new vis.DataSet([
    {id: "failure", content: 'Failure', value: 3},
    {id: "success", content: 'Success', value: 1}
  ]);

  var items = $j.what("timeline").data = new vis.DataSet(dataSet);

  // Configuration for the Timeline
  var options = {
    width: '100vw',
    //minHeight: '112px',
    maxHeight:'300px',
    margin: {
      item: 10
    },
    stack:false,
    //start:trend[0][0][0],
    end:'2019-01-05',
    min: new Date(2014, 0, 1),                // lower limit of visible range
    max: new Date(2019, 4, 1),                // upper limit of visible range
    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
    zoomMax: 1000 * 60 * 60 * 24 * 31 * 6,     // about three months in milliseconds
    showCurrentTime:true,
    onInitialDrawComplete: function() {
      // TODO: Switch to more eventing versus callback
      if(after) {
        after.apply(this, arguments);
      }
    }
  };

  // Create a Timeline
  var timeline = $j.what("timeline").timeline = new vis.Timeline(container, items, options);
  timeline.setGroups(groups);

  $j.el("timeline").actors({
    type:"timeline"
  });
}

function buildNetwork(after) {
  var container = $j.el("network")[0];

  var nodes = new vis.DataSet($j.studio("nodes", $j.o("nodes"))),
    edges = new vis.DataSet(),
    data = $j.what("vis", {
      nodes:nodes,
      edges:edges
    });

  var options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    clickToUse: false,
    edges: {
      arrows: {
        to:{
          enabled:true,
          scaleFactor:1
        }
      },
      //arrowStrikethrough:true,
      scaling:{
        min:1,
        max:8
      },
      smooth: {
        type: "dynamic",
        roundness:0.3,
        forceDirection: "none"
      }
    },
    nodes: {
      labelHighlightBold: false,
      mass: 2
    },
    physics: {
      enabled: false
    },
    interaction:{
      hover:false,
      hoverConnectedEdges: false,
      selectConnectedEdges:false
    }
  };

  $j.what("network").network = new vis.Network(container, data, options);

  $j.studio("updatePath", "digitalComm1")

  $j.el("inspector").actors({
    type:"network"
  });

  if(after) {
    after.apply(this, arguments);
  }
}

// TODO: Refactor this crappy crappy procedure
function populateNetwork(successes, failures) {
  var modelPaths = $j.o("path", "digitalComm1");
  var collection = {};
  var edges = {};

  var history = $j.what("history", {})

  generatePath("Good", $j.simulation("distribute", successes, modelPaths.length), collection);
  generatePath("Bad", $j.simulation("distribute", failures, modelPaths.length), collection);

  function generatePath(type, distribution, collection) {
    $j.each(distribution, function(i, total) {
      var paths = $j.simulation("generate"+type+"Paths", total, modelPaths[i]);

      var pathHistory = history[i+1];
      if(!pathHistory) {
        pathHistory = history[i+1] = {
          Good:{},
          Bad:{}
        };
      }
      pathHistory[type] = paths;


      $j.each(paths, function(i) {
        var node = collection[this.id];
        if(!node) {
          node = collection[this.id] = $j.extend($j.extend({}, $j.o("vis", "nodes").get(this.id)).logistics, this);
        } else {
          $j.each(this, function(key,value) {
            if(key!=="id") {
              if(key==="duds") {
                var duds = node.duds;
                $j.each(value, function(dudKey, dudValue) {
                  duds[dudKey] = duds[dudKey] + dudValue;
                })
              } else {
                node[key] = node[key] + value;
              }
            }
          })
        }
      })
    })

    return collection;
  }

  var nodes = [];
  $j.each(collection, function(id, node) {
    var o = {};
    o.id = id;
    o.logistics = node;
    nodes.push(o);
  });

  $j.studio("updateNodes", nodes);

  // Generate Edges
  var edges = {}
  $j.each(modelPaths, function(i, modelPath) {
    $j.each(modelPath, function(i, thisEdge) {
      var edge = edges[thisEdge.id];
      if(!edge) {
        edge = edges[thisEdge.id] = thisEdge;
        edge.value = 0;
        edge.value = $j.o("vis", "nodes").get(thisEdge.from).logistics.out;
      } else {
        edge.value = edge.value + $j.o("vis", "nodes").get(thisEdge.from).logistics.out;
      }

    })
  });
  var edgesArray = [];
  $j.each(edges, function(id, edge) {
    edgesArray.push(edge);
  })
  $j.o("vis", "edges").update(edgesArray);

  return collection;
}




