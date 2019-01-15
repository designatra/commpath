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

  buildTimeline(function() {
    buildNetwork();
  });
}

function buildTimeline(after) {
  var container = $j.el("timeline")[0];

  // Create a DataSet (allows two way data-binding)
  var items = $j.what("timeline").data = new vis.DataSet([
    //{id: 1, content: 'item 1', start: '2018-04-20'},
    // {id: 2, content: 'item 2', start: '2018-04-14'},
    // {id: 3, content: 'item 3', start: '2018-04-18'},
    {id: guid(), content: 'Yay!', start: '2018-01-01'},
    // {id: 5, content: 'item 5', start: '2018-04-25'},
    // {id: 6, content: 'item 6', start: '2018-04-27'}
  ]);

  // Configuration for the Timeline
  var options = {
    width: '100vw',
    minHeight: '112px',
    maxHeight:'300px',
    margin: {
      item: 20
    },
    start:'2018-01-01',
    end:'2019-01-13',
    min: new Date(2018, 0, 1),                // lower limit of visible range
    max: new Date(2019, 4, 1),                // upper limit of visible range
    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
    zoomMax: 1000 * 60 * 60 * 24 * 31 * 3,     // about three months in milliseconds
    showCurrentTime:true,
    onInitialDrawComplete: function() {
      // TODO: Switch to more eventing versus callback
      if(after) {
        after.apply(this, arguments);
      }
    }
  };

  // Create a Timeline
  var timeline =$j.what("timeline").timeline = new vis.Timeline(container, items, options);

  $j.el("timeline").actors({
    type:"timeline"
  });
}

function buildNetwork() {
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
}




