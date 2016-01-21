"use strict";

import debug from 'debug';
import optimist from 'optimist';
import io from 'socket.io-client';

// debug logger
var socketDebug = debug('socket:client');

// argv
var argv = optimist
    .default({
        id: 1,
        host: 'http://localhost:3000'
    })
    .argv;

var connectNamespace = (namespace) => {
    var csio = io(argv.host + '/' + namespace);
    csio.on('connect', () => {
        socketDebug('connect', namespace);
        csio.emit('set idRestaurant', argv.id, () => {
            socketDebug('idRestaurant sent', namespace);
            var dataListener = (data) => {
                socketDebug(namespace, 'data', data);
            };
            csio.on('data', dataListener);
            csio.once('disconnect', () => {
                csio.removeListener('data', dataListener);
            });
        });
    });
};

connectNamespace('reservation');
connectNamespace('customer');
