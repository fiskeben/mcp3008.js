# mcp3008.js

A node.js module for interfacing the MCP3008 analog/digital converter.

The same instance of the module can control all eight channels on the converter.

## Installation

```
$ npm install mcp3008.js
```

## Usage

Here's a short example:

```
var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008(),
    channel = 0;

adc.read(channel, function (value) {
    doSomethingToValue(value);
});
```

## Interface

### Constructor

```
new Mcp3008([device]);
```

Device defaults to `/dev/spidev0.0`.

### Reading

```
instance.read(channel, callback);
```

This will read the value on `channel` and send it to `callback`.

### Polling

```
instance.poll(channel, interval, callback);
```

This will read the value on `channel` every `interval` milliseconds and send it to `callback`. Use `instance.stop(channel)` to stop it.

### Tear down

```
instance.close();
```

This will release the device and stop polling (if any).
