# Commpath Studio
## Interactive tool for monitoring the live and past logistical flow of various internal infrastructure. 

Currently a work in progress, it is populated with data that seeds the history with simulation worthy details. As you zoom (with scroll wheel on mouse) and pan (by clicking and dragging on the timeline), you change the data perspective, thus updating the network stats. 

Try zooming way in. Notice how the numbers on a node become smaller, while zooming out, they become large. 

You may also focus on network path, which represents a type of transaction. This will hide the other paths, and also filter the network node values. While a path is selected, any changes to the data perspective (via the timeline) will be respected.

The network nodes typically display three values. The first number (blue) represents inbound messages, while the third number (green), represents outbound messages. As issues arise (for various reasons), messages become held up, and are recorded as the red number. Selecting a node, opens the inspecctor, providing (albeit still very buggy) a more detailed view into the respective nodes values.

Arrow width changes depending on the relative amount of traffic along the path.

The timeline also sports a changing heatmap. As you scroll into the past, you will notice both the failure and success totals are illustrated by a darker red or a deeper green. These colors shades provide simple visual cues into the periods with high failures and/or high messaging.

The Play/Stop/Reset controls on the right side of the UI, have a bug, and will be addressed. Once fixed, they provide a realtime view of the network. From the moment, play is initiatied, the network accumulates traffic.

### Requirements
1. Node & Npm 
2. Current version of Chrome. 
3. Port 8080 available. 
Everything else should be handled on install.

Webserver runs on port 80, and appserver runs on port 8080. Sometimes port 80 can be an issue, requiring admin rights. Changing the webserver port, however, may prove problematic, even though I have enabled cors.

### Setup & Run
1. Clone codebae from > https://github.com/aaa-ncnu-ie/commpath.git
2. Run > "npm install"
3. Run > "npm start"
4. Navigate to > "http://0.0.0.0/studio/"

Terminating the two webservers can be problematic; if they do not self-terminate when closing the process:
Run > "killall -9 node"
