function pageBuilder() {
  buildVis();
}

function buildVis() {
  var nodes = new vis.DataSet($j.studio("nodes", $j.o("nodes")));

  var edges = new vis.DataSet($j.o("edges"));

  // create a network
  var container = $j.el("papa").children("#viz")[0];
  var data = {
    nodes: nodes,
    edges: edges
  };

  var options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    clickToUse: false,
    layout: {
      hierarchical: {
        enabled: true,
        //levelSeparation: -126,
        //nodeSpacing: 245,
        //treeSpacing: 440,
        direction: "LR",
        sortMethod: "directed"
      }
    },
    physics: {
      stabilization: false
    },
    edges: {
      arrows: {
        to:{
          enabled:true,
          scaleFactor:.5
        }
      },
      arrowStrikethrough:false,
      chosen:{
        edge:true
      },
      color: {
        hover: "#1778d3",
        inherit: false
      },
      scaling:{
        min:1,
        max:8
      },
      smooth: {
        type: "horizontal",
        roundness:0.3
      },
    },
    nodes: {
      //borderWidth: 1,
      //borderWidthSelected: 1,
      chosen: true,
      color: {
        //border: '#666666',
        //background: 'white',
        highlight: {
          border: '#1778d3',
          background: 'white'
        },
        hover: {
          border: '#1778d3',
          background: '#D2E5FF'
        }
      },
      // font: {
      //   color: '#343434',
      //   size: 14, // px
      //   face: 'Raleway',
      //   background: 'none',
      //   strokeWidth: 0, // px
      //   strokeColor: '#ffffff',
      //   align: 'center',
      //   multi: true,
      //   vadjust: 1
      // },
      labelHighlightBold: false,
      mass: 1,
      // shadow:{
      //   enabled: true,
      //   color: 'rgba(0,0,0,0.8)',
      //   size:4,
      //   x:2,
      //   y:2
      // },
      /*    W/ LABEL: ellipse, circle, database, box, text
            NO Label: image, circularImage, diamond, dot, star, triangle, triangleDown, hexagon, square and icon
      */
      //shape: 'box',
      // scaling:{
      //   min:8,
      //   max:650,
      //   // label: {
      //   //   min:12,
      //   //   max:16
      //   // }
      // },
      // widthConstraint:{
      //   minimum:30,
      //   maximum:100
      // },
      // heightConstraint:{
      //   minimum:30
      // },
      // margin:{
      //   top:0,
      //   right:10,
      //   bottom:0,
      //   left:10
      // },
      shapeProperties: {
        borderRadius: 1
      }
    },
    interaction:{
      hover:true
    },
    manipulation: {
      enabled: true
    }
  };


  var network = new vis.Network(container, data, options);

  network.on("click", function (params) {
    params.event = "[original event]";
    document.getElementById('inspector').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);
    console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
  });
}




