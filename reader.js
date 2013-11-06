var sensor = require('./build/Release/reader');

var MCP3008Reader = function() {
    this.read = function() {
        return sensor.reader();
    }
}

module.exports = MCP3008Reader;
