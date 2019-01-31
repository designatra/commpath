# commpath

Requires Node & Npm & current version of Chrome. Everything else should be handled on install.

Webserver runs on port 80, and appserver runs on port 8080. Sometimes port 80 can be an issue, requiring admin rights. Changing the webserver port may prove problematic, even with Cors.

1. Clone codebae from > https://github.com/aaa-ncnu-ie/commpath.git
2. Run > "npm install"
3. Run > "npm start"
4. Navigate to > "http://0.0.0.0/studio/"

Terminating the two webservers can be problematic, so if they dont self-terminate when closing the process
Run > "killall -9 node"
