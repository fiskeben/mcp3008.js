var Reader = require('./reader');

var r = new Reader();

r.poll(0, 250, function (value) {
    console.log("Read", value);
});

setTimeout(function () { r.close(); }, 10000);
