function pageBuilder() {
  var $papa = $j(this);

  buildVis();
}

function buildVis() {
  var nodes = new vis.DataSet([
    {
      id: 1,
      value:10,
      title:'',
      label: 'PAS',
      x: 1,
      y: 1
    },
    {
      id: 2,
      value:10,
      title:'10 IN / 1 FAIL',
      label: 'MDM'
    },
    {
      id: 3,
      value:9,
      title:'9 IN / 9 OUT',
      label: 'SOA'
    },
    {
      id: 4,
      value:9,
      title:'9 IN / 5 FAIL',
      label: 'Digital COM'
    },
    {
      id: 5,
      value:2,
      title:'2 IN',
      label: 'DCS'
    },
    {
      id: 6,
      value:4,
      title:'4 IN',
      label: 'Delivery Engine'
    },
    {
      id: 7,
      value:5,
      title:'10 IN',
      label: 'Events Consumer'
    },
    {
      id: 8,
      value:4,
      title:'4 IN',
      label: 'Customer'
    }
  ]);

  var edges = new vis.DataSet([
    {
      from: 1,
      to: 2,
      value:10,
      title:'10 Outbound',
      arrows: 'to'
    },
    {
      from: 1,
      to: 7,
      value:10,
      title:'10 Outbound',
      arrows: 'to'
    },
    {
      from: 2,
      to: 3,
      value:9,
      title:'9 Outbound',
      arrows: 'to'
    },
    {
      from: 3,
      to: 4,
      value:9,
      title:'9 Outbound',
      arrows: 'to'
    },
    {
      from: 4,
      to: 6,
      value:4,
      title:'4 Outbound',
      arrows: 'to'
    },
    {
      from: 6,
      to: 8,
      value:4,
      title:'4 Outbound',
      arrows: 'to'
    },
    {
      from: 4,
      to: 5,
      value:2,
      title:'2 Outbound',
      arrows: 'to'
    }
  ]);

  // create a network
  var container = $j.el("papa")[0];
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
        levelSeparation: -126,
        nodeSpacing: 245,
        treeSpacing: 440,
        direction: "LR",
        sortMethod: "directed"
      }
    },
    edges: {
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
        max:5
      },
      smooth: {
        type: "horizontal",
        roundness:0.7
      },
    },
    nodes: {
      borderWidth: 1,
      borderWidthSelected: 1,
      chosen: true,
      color: {
        border: '#666666',
        background: 'white',
        highlight: {
          border: '#1778d3',
          background: 'white'
        },
        hover: {
          border: '#1778d3',
          background: '#D2E5FF'
        }
      },
      font: {
        color: '#343434',
        size: 14, // px
        face: 'Raleway',
        background: 'none',
        strokeWidth: 0, // px
        strokeColor: '#ffffff',
        align: 'center',
        multi: true,
        vadjust: 1
      },
      labelHighlightBold: false,
      mass: 1,
      shadow:{
        enabled: true,
        color: 'rgba(0,0,0,0.2)',
        size:4,
        x:2,
        y:2
      },
      /*    W/ LABEL: ellipse, circle, database, box, text
            NO Label: image, circularImage, diamond, dot, star, triangle, triangleDown, hexagon, square and icon
      */
      shape: 'box',
      scaling:{
        min:8,
        max:50,
        // label: {
        //   min:12,
        //   max:16
        // }
      },
      widthConstraint:{
        minimum:30,
        maximum:100
      },
      heightConstraint:{
        minimum:30
      },
      margin:{
        top:0,
        right:10,
        bottom:0,
        left:10
      },
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
}
