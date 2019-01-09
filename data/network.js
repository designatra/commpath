$j.what("network", {
  nodes: [
    {
      id:guid(),
      logistics:{
        in:630,
        out:597,
        duds:{
          biz:33,
          it:0,
          planned:0
        }
      },
      entity:{
        type:"application",
        id:1
      }
    },
    {
      id:guid(),
      logistics:{
        in:597,
        out:509,
        duds:{
          biz:88,
          it:0,
          planned:0
        }
      },
      entity:{
        type:"application",
        id:2
      }
    },
    {
      id:guid(),
      logistics:{
        in:509,
        out:458,
        duds:{
          biz:51,
          it:0,
          planned:0
        }
      },
      entity:{
        type:"application",
        id:3
      }
    },
    {
      id:guid(),
      logistics:{
        in:458,
        out:274,
        duds:{
          biz:184,
          it:0,
          planned:0
        }
      },
      entity:{
        type:"application",
        id:4
      }
    },
    {
      id:guid(),
      logistics:{
        in:136,
        out:0
      },
      entity:{
        type:"application",
        id:5
      }
    },
    {
      id:guid(),
      logistics:{
        in:138,
        out:131,
        duds:{
          biz:7,
          it:0,
          planned:0
        }
      },
      entity:{
        type:"application",
        id:6
      }
    },
    {
      id:guid(),
      logistics:{
        in:10,
        out:0
      },
      entity:{
        type:"application",
        id:7
      }
    },
    {
      id:guid(),
      logistics:{
        in:131,
        out:0
      },
      entity:{
        type:"application",
        id:8
      }
    }
  ],
  edges: [
    {
      id:guid(),
      from: 1,
      to: 2,
      arrows: 'to',
      value: 597,
      title: ''
    },
    {
      id:guid(),
      from: 1,
      to: 7,
      arrows: 'to',
      value: 10,
      title: ''
    },
    {
      id:guid(),
      from: 2,
      to: 3,
      arrows: 'to',
      value:509,
      title: ''
    },
    {
      id:guid(),
      from: 3,
      to: 4,
      arrows: 'to',
      value: 458,
      title: ''
    },
    {
      id:guid(),
      from: 4,
      to: 6,
      arrows: 'to',
      value: 138,
      title: ''
    },
    {
      id:guid(),
      from: 6,
      to: 8,
      arrows: 'to',
      value: 131,
      title: ''
    },
    {
      id:guid(),
      from: 4,
      to: 5,
      arrows: 'to',
      value: 136,
      title: ''
    }
  ]
});
