"use strict";

import debug from 'debug';
import optimist from 'optimist';
import amqp from 'amqplib-easy';
import io from 'socket.io';

// debug logger
var debugSocket = debug('socket:server');
var debugAmqp = debug('amqp');

// argv
var argv = optimist
    .default({
        amqpHost: 'amqp://localhost',
        port: 3000
    })
    .argv;

// socket io server
var ssio = io.listen(argv.port);

// amqp client
var amqpClient = amqp(argv.amqpHost);

var createNamespace = (namespace) => {
    ssio.of(namespace).on('connection', (socket) => {
        debugSocket('connection', namespace);
        socket.on('set idRestaurant', (idRestaurant, done) => {
            debugSocket('set idRestaurant', namespace, idRestaurant);
            socket.join('restaurant_' + idRestaurant);
            done();
        });
    });
};

var consumeAmqpQueue = (queueName) => {
    amqpClient.consume({ queue: queueName }, (message) => {
        debugAmqp('Found ' + queueName, message.json);
        ssio.of(queueName).in('restaurant_' + message.json.idRestaurant).emit('data', message.json);
    });
};

createNamespace('reservation');
consumeAmqpQueue('reservation');

createNamespace('customer');
consumeAmqpQueue('customer');
