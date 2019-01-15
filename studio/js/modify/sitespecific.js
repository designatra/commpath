function pageBuilder() {
  $j(this).build("inspector");

  // $j(this).build("communications", function(i, data) {
  //   $j(this).find("> wrapper > wrapper").build("communication", $j.o("communications"))
  // })

  $j.el("papa")
    .find("#simulationControls")
    .actors({
      type:"simulation"
    });
  //
  // buildTimeline(function() {
  //   buildNetwork();
  // });

  buildNetwork(function() {
    buildTimeline();
  });
}

function buildTimeline(after) {
  var container = $j.el("timeline")[0];

  var dataSet = [];
  var trend = $j.o("trends", "week", 2014);
  trend[0].forEach(function(week, i) {
      var end = dayjs(week[0]).endOf("week").format("YYYY-MM-DD");
      // Success
      dataSet.push({
        id:guid(),
        start:week[0],
        end:end,
        content:scaleUp(week[2]).toString(),
        group:"success"
      });

      var week_alt = trend[1][i];
      // Failure
      dataSet.push({
        id:guid(),
        start:week[0],
        end:end,
        content:(week_alt[1]*random([67,71])).toString(),
        group:"failure"
      })
  });

  function scaleUp(eventTotal) {
    return (eventTotal*1)*random([283,286]);
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
    start:trend[0][0][0],
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




