$j.what("network", {
  nodes: [
    {
      id:guidGenerator(),
      value: 10,
      title: '',
      entity:{
        type:"application",
        id:1
      }
    },
    {
      id:guidGenerator(),
      value: 10,
      title: '10 IN / 1 FAIL',
      entity:{
        type:"application",
        id:2
      }
    },
    {
      id:guidGenerator(),
      value: 9,
      title: '9 IN / 9 OUT',
      entity:{
        type:"application",
        id:3
      }
    },
    {
      id:guidGenerator(),
      value: 9,
      title: '9 IN / 5 FAIL',
      entity:{
        type:"application",
        id:4
      }
    },
    {
      id:guidGenerator(),
      value: 2,
      title: '2 IN',
      entity:{
        type:"application",
        id:5
      }
    },
    {
      id:guidGenerator(),
      value: 4,
      title: '4 IN',
      entity:{
        type:"application",
        id:6
      }
    },
    {
      id:guidGenerator(),
      value: 5,
      title: '10 IN',
      entity:{
        type:"application",
        id:7
      }
    },
    {
      id:guidGenerator(),
      value: 4,
      title: '4 IN',
      entity:{
        type:"application",
        id:8
      }
    }
  ],
  edges: [
    {
      id:guidGenerator(),
      from: 1,
      to: 2,
      value: 10,
      title: '10 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 1,
      to: 7,
      value: 10,
      title: '10 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 2,
      to: 3,
      value: 9,
      title: '9 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 3,
      to: 4,
      value: 9,
      title: '9 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 4,
      to: 6,
      value: 4,
      title: '4 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 6,
      to: 8,
      value: 4,
      title: '4 Outbound',
      arrows: 'to'
    },
    {
      id:guidGenerator(),
      from: 4,
      to: 5,
      value: 2,
      title: '2 Outbound',
      arrows: 'to'
    }
  ]
});