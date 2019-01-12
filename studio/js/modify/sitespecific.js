function pageBuilder() {
  $j(this).build("inspector");

  // $j(this).build("communications", function(i, data) {
  //   $j(this).find("> wrapper > wrapper").build("communication", $j.o("communications"))
  // })
  buildVis();

  $j.el("papa")
    .find("#simulationControls")
    .actors({
      type:"simulation"
    });
}

function buildVis() {
  var nodes = new vis.DataSet($j.studio("nodes", $j.o("nodes")));

  var edges = new vis.DataSet(); //$j.o("edges")

  var data = $j.what("vis", {
    nodes:nodes,
    edges:edges
  });

  // create a network
  var container = $j.el("papa").children("#viz")[0];
  // var data = {
  //   nodes: nodes,
  //   edges: edges
  // };

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
    // manipulation: {
    //   enabled: true
    // }
  };

  $j.what("network").network = new vis.Network(container, data, options);

  $j.studio("updatePath", "digitalComm1")

  $j.el("inspector").actors({
    type:"network"
  });
}




