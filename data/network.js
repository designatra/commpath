$j.what("network", {
  nodes: [
    {
      id:1,
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
      id:2,
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
      id:3,
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
      id:4,
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
      id:5,
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
      id:6,
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
      id:7,
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
      id:8,
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
      id:"edge100",
      from: 1,
      to: 2,
      arrows: 'to',
      value: 597,
      title: ''
    },
    {
      id:"edge101",
      from: 1,
      to: 7,
      arrows: 'to',
      value: 10,
      title: ''
    },
    {
      id:"edge102",
      from: 2,
      to: 3,
      arrows: 'to',
      value:509,
      title: ''
    },
    {
      id:"edge103",
      from: 3,
      to: 4,
      arrows: 'to',
      value: 458,
      title: ''
    },
    {
      id:"edge104",
      from: 4,
      to: 6,
      arrows: 'to',
      value: 138,
      title: ''
    },
    {
      id:"edge105",
      from: 6,
      to: 8,
      arrows: 'to',
      value: 131,
      title: ''
    },
    {
      id:"edge106",
      from: 4,
      to: 5,
      arrows: 'to',
      value: 136,
      title: ''
    }
  ],
  paths: {
    // Preparing for having many different types of digital communications
    digitalComm1: [
      // PATH ONE
      [
        {
          id:"edge100",
          from: 1,
          to: 2,
          arrows: 'to',
          value: 597,
          title: ''
        },
        {
          id:"edge102",
          from: 2,
          to: 3,
          arrows: 'to',
          value:509,
          title: ''
        },
        {
          id:"edge103",
          from: 3,
          to: 4,
          arrows: 'to',
          value: 458,
          title: ''
        },
        {
          id:"edge106",
          from: 4,
          to: 5,
          arrows: 'to',
          value: 136,
          title: ''
        }
      ],
      // PATH 2
      [
        {
          id:"edge107",
          from: 1,
          to: 3,
          arrows: 'to',
          value: 597,
          title: ''
        },
        {
          id:"edge108",
          from: 3,
          to: 6,
          arrows: 'to',
          value: 458,
          title: ''
        },
        {
          id:"edge105",
          from: 6,
          to: 8,
          arrows: 'to',
          value: 136,
          title: ''
        }
      ],
      // PATH 3
      [
        {
          id:"edge109",
          from: 1,
          to: 4,
          arrows: 'to',
          value: 597,
          title: ''
        },
        {
          id:"edge106",
          from: 4,
          to: 5,
          arrows: 'to',
          value: 458,
          title: ''
        }
      ],
      // PATH 4
      [
        {
          id:"edge100",
          from: 1,
          to: 2,
          arrows: 'to',
          value: 597,
          title: ''
        },
        {
          id:"edge102",
          from: 2,
          to: 3,
          arrows: 'to',
          value: 458,
          title: ''
        },
        {
          id:"edge108",
          from: 3,
          to: 6,
          arrows: 'to',
          value: 458,
          title: ''
        },
        {
          id:"edge105",
          from: 6,
          to: 8,
          arrows: 'to',
          value: 458,
          title: ''
        }
      ]
    ]
  }
});
