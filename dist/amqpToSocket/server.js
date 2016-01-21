"use strict";

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _amqplibEasy = require('amqplib-easy');

var _amqplibEasy2 = _interopRequireDefault(_amqplibEasy);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// debug logger
var debugSocket = (0, _debug2.default)('socket:server');
var debugAmqp = (0, _debug2.default)('amqp');

// argv
var argv = _optimist2.default.default({
    amqpHost: 'amqp://localhost',
    port: 3000
}).argv;

// socket io server
var ssio = _socket2.default.listen(argv.port);

// amqp client
var amqpClient = (0, _amqplibEasy2.default)(argv.amqpHost);

var createNamespace = function createNamespace(namespace) {
    ssio.of(namespace).on('connection', function (socket) {
        debugSocket('connection', namespace);
        socket.on('set idRestaurant', function (idRestaurant, done) {
            debugSocket('set idRestaurant', namespace, idRestaurant);
            socket.join('restaurant_' + idRestaurant);
            done();
        });
    });
};

var consumeAmqpQueue = function consumeAmqpQueue(queueName) {
    amqpClient.consume({ queue: queueName }, function (message) {
        debugAmqp('Found ' + queueName, message.json);
        ssio.of(queueName).in('restaurant_' + message.json.idRestaurant).emit('data', message.json);
    });
};

createNamespace('reservation');
consumeAmqpQueue('reservation');

createNamespace('customer');
consumeAmqpQueue('customer');