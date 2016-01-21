"use strict";

import debug from 'debug';
import optimist from 'optimist';
import diehard from 'diehard';
import amqp from 'amqplib-easy';

// debug logger
var amqpDebug = debug('amqp');

// argv
var argv = optimist
    .default({
        queue: 'reservation',
        id: 1,
        host: 'amqp://localhost'
    })
    .argv;

// easy-amqplib is bound to diehard to kill connections on process exit
diehard.listen();

var amqpClient = amqp(argv.host);

amqpDebug(`sending random data to restaurant ${argv.id} on queue ${argv.queue}`);

amqpClient
    .sendToQueue({ queue: argv.queue }, {
        idRestaurant: argv.id,
        idReservation: Math.random() * 1e6 >> 0
    })
    .then(() => {
        amqpDebug('exiting');
        process.exit(0);
    })
;

