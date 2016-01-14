"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    var app, server, io;

    app = require('express')();
    server = (0, _http.Server)(app);
    io = (0, _socket2.default)(server);
    io.adapter((0, _socket4.default)({ host: 'localhost', port: 6379 }));

    console.log(process.pid, _cluster2.default.isMaster);

    if (!_stickySession2.default.listen(server, argv.port, { workers: 8 })) {

        // master

        server.once('listening', function () {
            console.log('listening on *:' + argv.port + ' on ' + process.pid);
        });

        setInterval(function () {
            // all workers will receive this in Redis, and emit
            io.emit('chat message', 'ping from process ' + process.pid);
        }, 1000);
    } else {

        //worker

        app.get('/', function (req, res) {
            res.sendFile(_path2.default.join(__dirname, '../views/index.html'));
        });

        io.on('connection', function (socket) {
            console.log('a user connected on ' + process.pid);

            socket.on('disconnect', function () {
                console.log('user disconnected on ' + process.pid);
            });

            socket.emit('connected', {
                pid: process.pid,
                wid: _cluster2.default.worker.id
            });

            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });
        });
    }
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _stickySession = require('sticky-session');

var _stickySession2 = _interopRequireDefault(_stickySession);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _socket3 = require('socket.io-redis');

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = _optimist2.default.default({
    port: 3000
}).argv;

module.exports = exports['default'];