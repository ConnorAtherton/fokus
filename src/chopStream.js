var Transform = require('stream').Transform;
var util = require('util');

var ChopStream = function() {
  this._buff;
  this._finished;

  Transform.call(this);
}

util.inherits(ChopStream, Transform);

ChopStream.prototype._transform = function(chunk, encoding, done) {
  console.log('chunky', chunk)
  this._push(chunk);
}

module.exports = ChopStream;
