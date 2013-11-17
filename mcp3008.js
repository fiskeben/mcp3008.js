SPI = require('spi');

var poller, timeout, spi;

function read(channel, callback) {
    if (spi === undefined)
        return;

    var txBuf = new Buffer([1, 8 + channel << 4, 0]),
        rxBuf = new Buffer([0,0,0]);

    spi.transfer(txBuf, rxBuf, function (device, buffer) {
        value = ((buffer[1] & 3) << 8) + buffer[2];
        callback(value);
    });
}

function startPoll (channel, callback) {
    poller = setInterval(function () {
        read(channel, callback);
    }, timeout);
}

var Reader = function (device) {
    this.device = device || '/dev/spidev0.0';
    spi = new SPI.Spi(this.device, [], function (s) {
        s.open();
    });

    this.read = read;

    this.poll = function (channel, duration, callback) {
        timeout = duration;
        startPoll(channel, callback);
    };

    this.close = function () {
        clearInterval(poller);
        spi.close();
    }
};

module.exports = Reader;
