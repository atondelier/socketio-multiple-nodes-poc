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


# Socketio consuming RabbitMQ queue POC

Start in separate terminals:

```
DEBUG=socket:server,amqp node dist/amqpToSocket/server
DEBUG=socket:client node dist/amqpToSocket/client --id=1
DEBUG=socket:client node dist/amqpToSocket/client --id=2
```

This has:
 - started the socket io server listening to the local RabbitMQ instance you should have started before and accessible on amqp://localhost (port 5672?)
 - and started 2 clients on restaurant ids 1 and 2 for restaurant and customer entities update

Then produce messages for both restaurants with the following commands:

```
DEBUG=amqp node dist/amqpToSocket/amqp-publish.js --id=1
DEBUG=amqp node dist/amqpToSocket/amqp-publish.js --id=2
```

You should see the clients log the messages corresponding to the right restaurant and entities.
