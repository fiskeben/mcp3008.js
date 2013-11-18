SPI = require('spi');

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

    var txBuf = new Buffer([1, 8 + channel << 4, 0]),
        rxBuf = new Buffer([0,0,0]);

    spi.transfer(txBuf, rxBuf, function (dev, buffer) {
        var value = ((buffer[1] & 3) << 8) + buffer[2];
        callback(value);
    });
}

function startPoll (channel, callback) {
    isLegalChannel(channel);
    channels[channel].poller = setInterval(function () {
        read(channel, callback);
    }, channels[channel].timeout);
}

function stopInstance (instance) {
    if (instance != undefined) {
        clearInterval(instance.poller);
    }
}

var Mcp3008 = function (dev) {
    device = dev || device;
    spi = new SPI.Spi(device, [], function (s) {
        s.open();
    });

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
