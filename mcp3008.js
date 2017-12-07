var SPI = require('pi-spi');

var channels = [],
    device = '/dev/spidev0.0',
    spi;

function isLegalChannel (channelNumber) {
    if (typeof channelNumber !== 'number' || channelNumber < 0 || channelNumber > 7) {
        throw new Error("Channel must be a number from 0 to 7");
    }
}

function read(channel, callback) {
    if (spi === undefined)
        return;

    var txBuf = new Buffer(3);
    txBuf.writeUInt8(1, 0);
    txBuf.writeUInt8((8 + channel) << 4, 1);
    txBuf.writeUInt8(0, 2);

    spi.transfer(txBuf, function (err, buffer) {
        if (err) throw err;

        var value = ((buffer[1] & 3) << 8) + buffer[2];
        callback(value);
    });
}

function stopInstance (instance) {
    if (instance !== undefined) {
        clearInterval(instance.poller);
    }
}

function startPoll (channel, callback) {
    isLegalChannel(channel);
    channels[channel].poller = setInterval(function () {
        read(channel, callback);
    }, channels[channel].timeout);
}

var Mcp3008 = function (dev) {
    device = dev || device;
    spi = SPI.initialize(device);

    this.read = read;

    this.poll = function (channel, duration, callback) {
        isLegalChannel(channel);
        channels[channel] = {'timeout': duration};
        startPoll(channel, callback);
    };

    this.stop = function (channel) {
        var instance = channels[channel];
        stopInstance(instance);
        channels[channel] = undefined;
    }

    this.close = function () {
        for (var i in channels) {
            var instance = channels[i];
            stopInstance(instance);
            channels[i] = undefined;
        }
        spi.close();
    }
};

module.exports = Mcp3008;
