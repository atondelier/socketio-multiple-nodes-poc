"use strict";

import path from 'path';
import {Server} from 'http';
import sio from 'socket.io';
import optimist from 'optimist';
import sticky from 'sticky-session';
import cluster from 'cluster';
import sioRedisAdapter from 'socket.io-redis';

var argv = optimist
    .default({
        port: 3000
    })
    .argv;

export default function() {

    var app, server, io;

    app = require('express')();
    server = Server(app);
    io = sio(server);
    io.adapter(sioRedisAdapter({ host: 'localhost', port: 6379 }));

    console.log(process.pid, cluster.isMaster);

    if (!sticky.listen(server, argv.port, { workers: 8 })) {

        // master

        server.once('listening', function() {
            console.log(`listening on *:${argv.port} on ${process.pid}`);
        });

        setInterval(function() {
            // all workers will receive this in Redis, and emit
            io.emit('chat message', `ping from process ${process.pid}`);
        }, 1000);

    } else {

        //worker

        app.get('/', function(req, res){
            res.sendFile(path.join(__dirname, '../views/index.html'));
        });

        io.on('connection', function(socket){
            console.log(`a user connected on ${process.pid}`);

            socket.on('disconnect', function(){
                console.log(`user disconnected on ${process.pid}`);
            });

            socket.emit('connected', {
                pid: process.pid,
                wid: cluster.worker.id
            });

            socket.on('chat message', function(msg){
                io.emit('chat message', msg);
            });

        });

    }

}
