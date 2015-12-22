import should from 'should';
import { Readable, Writable } from 'stream';
import BufferNexter from '../';

describe('Buffer Nexter', () => {
  let ary = [ 1, 22, 3, 4, 5 ],
    buf = new Buffer(ary.join(',')),
    opts = { separator: ',' };


  beforeEach(() => {
    buf = new Buffer(ary.join(','));
  });


  describe('Class', () => {

    it('should return an instance', () => {
      let b = new BufferNexter(buf);

      (b).should.be.an.instanceof(BufferNexter);
    });

    it('should not throw if given a String', () => {
      (function() { new BufferNexter('foo\nbar'); }).should.not.throw();
    });

    it('should not throw if given a Buffer', () => {
      (function() { new BufferNexter(new Buffer('foo\nbar')); }).should.not.throw();
    });

    it('should throw if given a non-String/Buffer', () => {
      (function() { new BufferNexter(1); }).should.throw();
    });

  });


  describe('readFile', () => {

    it('should read a file and make it nextable', (done) => {
      BufferNexter.readFile(__dirname + '/sample.txt')
        .then((b) => {
          (b.next()).should.eql('foo');
          (b.next()).should.eql('bar');
          done();
        })
        .catch(done);
    });

    it('should read a file and make it nextable with options', (done) => {
      BufferNexter.readFile(__dirname + '/sample.csv', { separator: ',' })
        .then((b) => {
          (b.next()).should.eql('foo');
          (b.next()).should.eql('bar');
          done();
        })
        .catch(done);
    });

  });


  describe('#next()', () => {

    it('should return a string value', () => {
      let b = new BufferNexter(buf, opts);

      (b.next()).should.eql('1');
    });

    it('should return iterative values', () => {
      let b = new BufferNexter(buf, opts);

      for (let i = 0; i < 5; i++)
        (b.next()).should.eql(ary[i].toString());
    });

    it('should return null when done', () => {
      let b = new BufferNexter(buf, opts);

      for (let i = 0; i < 5; i++)
        b.next();

      (b.next() === null).should.eql(true, 'not === null');
    });

    it('should iterate with newlines', () => {
      let b = new BufferNexter(new Buffer('foo\nbar'));

      (b.next()).should.eql('foo');
      (b.next()).should.eql('bar');
    });

  });


  describe('#skip()', () => {

    it('should be skippable', () => {
      let b = new BufferNexter(buf, opts);

      (b.skip(2).next()).should.eql('3');
    });

  });


  describe('#peek()', () => {

    it('should be peekable', () => {
      let b = new BufferNexter(new Buffer('foo\nbar'));

      (b.peek()).should.eql('foo');
      (b.next()).should.eql('foo');
      (b.next()).should.eql('bar');
    });

  });


  describe('#stream()', () => {

    it('should be a stream', (done) => {
      let b = new BufferNexter(buf, opts),
        stream = b.stream(),
        items = [];

      (stream).should.be.an.instanceof(Readable);

      stream.on('data', (data) => {
        items.push(data);
      });

      stream.on('end', () => {
        (items.length).should.eql(5);
        (items[1].toString()).should.eql('22');
        done();
      });
    });

  });


});
