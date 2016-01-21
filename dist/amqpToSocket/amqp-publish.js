"use strict";

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _diehard = require('diehard');

var _diehard2 = _interopRequireDefault(_diehard);

var _amqplibEasy = require('amqplib-easy');

var _amqplibEasy2 = _interopRequireDefault(_amqplibEasy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// debug logger
var amqpDebug = (0, _debug2.default)('amqp');

// argv
var argv = _optimist2.default.default({
    queue: 'reservation',
    id: 1,
    host: 'amqp://localhost'
}).argv;

// easy-amqplib is bound to diehard to kill connections on process exit
_diehard2.default.listen();

var amqpClient = (0, _amqplibEasy2.default)(argv.host);

amqpDebug('sending random data to restaurant ' + argv.id + ' on queue ' + argv.queue);

amqpClient.sendToQueue({ queue: argv.queue }, {
    idRestaurant: argv.id,
    idReservation: Math.random() * 1e6 >> 0
}).then(function () {
    amqpDebug('exiting');
    process.exit(0);
});