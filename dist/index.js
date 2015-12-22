'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _stream = require('stream');

var _util = require('util');

var _fs = require('fs');

var _process$versions$node$split$map = process.versions.node.split('.').map(Number);

var _process$versions$node$split$map2 = _slicedToArray(_process$versions$node$split$map, 3);

var major = _process$versions$node$split$map2[0];
var minor = _process$versions$node$split$map2[1];
var patch = _process$versions$node$split$map2[2];

if (major === 0) throw new Error('Sorry, BufferNexter requires node version >0.12');

var BufferNexter = (function () {
  function BufferNexter(buf) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BufferNexter);

    if (!(0, _util.isBuffer)(buf) && !(0, _util.isString)(buf)) throw new Error('First argument must be a Buffer or String');

    var _options$separator = options.separator;
    var separator = _options$separator === undefined ? '\n' : _options$separator;
    var _options$index = options.index;
    var index = _options$index === undefined ? 0 : _options$index;
    var _options$encoding = options.encoding;
    var encoding = _options$encoding === undefined ? 'utf8' : _options$encoding;

    this._buf = buf;
    this._separator = separator;
    this._index = index;
    this._encoding = encoding;
    this._done = false;
  }

  _createClass(BufferNexter, [{
    key: 'next',
    value: function next(peek) {
      if (this._done === true) return null;

      var end = this._buf.indexOf(this._separator, this._index),
          value = null;

      if (this._index > 0 && end === -1) {
        this._done = true;
        value = this._buf.toString(this._encoding, this._index);
      } else if (end !== -1) {
        value = this._buf.toString(this._encoding, this._index, end);
      }

      if (!peek) this._index = end + 1;

      return value;
    }
  }, {
    key: 'skip',
    value: function skip() {
      var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      for (var i = 0; i < n; i++) {
        this.next();
      }return this;
    }
  }, {
    key: 'peek',
    value: function peek() {
      return this.next(true);
    }
  }, {
    key: 'stream',
    value: function stream() {
      var next = this.next.bind(this);

      return new _stream.Readable({
        read: function read(n) {
          var data = undefined;

          while (data = next()) this.push(data);

          this.push(null);
        }
      });
    }
  }], [{
    key: 'readFile',
    value: function readFile(file, options) {
      return new Promise(function (resolve, reject) {
        (0, _fs.readFile)(file, function (err, buf) {
          if (err) return reject(err);

          resolve(new BufferNexter(buf, options));
        });
      });
    }
  }]);

  return BufferNexter;
})();

exports['default'] = BufferNexter;
module.exports = exports['default'];