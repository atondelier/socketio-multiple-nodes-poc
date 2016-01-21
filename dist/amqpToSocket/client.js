"use strict";

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// debug logger
var socketDebug = (0, _debug2.default)('socket:client');

// argv
var argv = _optimist2.default.default({
    id: 1,
    host: 'http://localhost:3000'
}).argv;

var connectNamespace = function connectNamespace(namespace) {
    var csio = (0, _socket2.default)(argv.host + '/' + namespace);
    csio.on('connect', function () {
        socketDebug('connect', namespace);
        csio.emit('set idRestaurant', argv.id, function () {
            socketDebug('idRestaurant sent', namespace);
            var dataListener = function dataListener(data) {
                socketDebug(namespace, 'data', data);
            };
            csio.on('data', dataListener);
            csio.once('disconnect', function () {
                csio.removeListener('data', dataListener);
            });
        });
    });
};

connectNamespace('reservation');
connectNamespace('customer');