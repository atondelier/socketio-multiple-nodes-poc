# Socketio multiple nodes POC

This module uses:
 - [sticky-session](https://github.com/indutny/sticky-session) to ensure same process is used between the handshake and the socket connection,
 - [socket.io-redis adapter](https://github.com/socketio/socket.io-redis) to ensure all messages are emitted all instances of this module.

To prove sockets are correctly communicating on all processes of all node instances:
 - start a redis instance on port 6379
 - start multiple instances of this module on separate ports

   ```
   node index --port=3000
   node index --port=3001
   ```
 - open browsers on localhost on all listened ports
 - do the same on another device with another IP address (to be balanced to another process a started instance)

Then you see messages from all instances are visible on each browser of each device.
