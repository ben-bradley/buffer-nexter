'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _stream = require('stream');

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('Buffer Nexter', function () {
  var ary = [1, 22, 3, 4, 5],
      buf = new Buffer(ary.join(',')),
      opts = { separator: ',' };

  beforeEach(function () {
    buf = new Buffer(ary.join(','));
  });

  describe('Class', function () {

    it('should return an instance', function () {
      var b = new _2['default'](buf);

      b.should.be.an['instanceof'](_2['default']);
    });

    it('should not throw if given a String', function () {
      (function () {
        new _2['default']('foo\nbar');
      }).should.not['throw']();
    });

    it('should not throw if given a Buffer', function () {
      (function () {
        new _2['default'](new Buffer('foo\nbar'));
      }).should.not['throw']();
    });

    it('should throw if given a non-String/Buffer', function () {
      (function () {
        new _2['default'](1);
      }).should['throw']();
    });
  });

  describe('readFile', function () {

    it('should read a file and make it nextable', function (done) {
      _2['default'].readFile(__dirname + '/sample.txt').then(function (b) {
        b.next().should.eql('foo');
        b.next().should.eql('bar');
        done();
      })['catch'](done);
    });

    it('should read a file and make it nextable with options', function (done) {
      _2['default'].readFile(__dirname + '/sample.csv', { separator: ',' }).then(function (b) {
        b.next().should.eql('foo');
        b.next().should.eql('bar');
        done();
      })['catch'](done);
    });
  });

  describe('#next()', function () {

    it('should return a string value', function () {
      var b = new _2['default'](buf, opts);

      b.next().should.eql('1');
    });

    it('should return iterative values', function () {
      var b = new _2['default'](buf, opts);

      for (var i = 0; i < 5; i++) {
        b.next().should.eql(ary[i].toString());
      }
    });

    it('should return null when done', function () {
      var b = new _2['default'](buf, opts);

      for (var i = 0; i < 5; i++) {
        b.next();
      }(b.next() === null).should.eql(true, 'not === null');
    });

    it('should iterate with newlines', function () {
      var b = new _2['default'](new Buffer('foo\nbar'));

      b.next().should.eql('foo');
      b.next().should.eql('bar');
    });
  });

  describe('#skip()', function () {

    it('should be skippable', function () {
      var b = new _2['default'](buf, opts);

      b.skip(2).next().should.eql('3');
    });
  });

  describe('#peek()', function () {

    it('should be peekable', function () {
      var b = new _2['default'](new Buffer('foo\nbar'));

      b.peek().should.eql('foo');
      b.next().should.eql('foo');
      b.next().should.eql('bar');
    });
  });

  describe('#stream()', function () {

    it('should be a stream', function (done) {
      var b = new _2['default'](buf, opts),
          stream = b.stream(),
          items = [];

      stream.should.be.an['instanceof'](_stream.Readable);

      stream.on('data', function (data) {
        items.push(data);
      });

      stream.on('end', function () {
        items.length.should.eql(5);
        items[1].toString().should.eql('22');
        done();
      });
    });
  });
});