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
    layout: {
      hierarchical: {
        enabled: false,
        // Distance between levels.
        levelSeparation: 200,
        // Minimum distance between nodes on the free axis.
        nodeSpacing: 300,
        // Distance between different trees (independent networks).
        treeSpacing: 100,
        direction: "LR",
        sortMethod: "directed",
        blockShifting:true,
        edgeMinimization:true,
        parentCentralization:false
      }
    },
    // physics: {
    //   // minVelocity:0.75,
    //   enabled:true,
    //   stabilization: true,
    //   hierarchicalRepulsion: {
    //     centralGravity: 0.0,
    //     springLength: 100,
    //     springConstant: 0.01,
    //     nodeDistance: 120,
    //     damping: 0.09
    //   }
    // },
    edges: {
      selfReferenceSize: 30,
      arrows: {
        to:{
          enabled:true,
          scaleFactor:.3
        }
      },
      arrowStrikethrough:true,
      scaling:{
        min:1,
        max:8
      },
      // physics:false,
      smooth: {
        type: "dynamic",
        roundness:0.3,
        forceDirection: "none"
      }
    },
    nodes: {
      labelHighlightBold: false,
      // widthConstraint: 250,
      mass: 2
    },
    physics: {
      enabled: false
    },
    interaction:{
      // dragNodes:false,
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




