'use strict';

import { Readable } from 'stream';
import { isString, isBuffer } from 'util';
import { readFile } from 'fs';

export default class BufferNexter {
  constructor(buf, options = {}) {
    if (!isBuffer(buf) && !isString(buf))
      throw new Error('First argument must be a Buffer or String');

    let {
      separator = '\n',
      index = 0,
      encoding = 'utf8'
    } = options;

    this._buf = buf;
    this._separator = separator;
    this._index = index;
    this._encoding = encoding;
    this._done = false;
  }

  next(peek) {
    if (this._done === true)
      return null;

    let end = this._buf.indexOf(this._separator, this._index),
      value = null;

    if (this._index > 0 && end === -1) {
      this._done = true;
      value = this._buf.toString(this._encoding, this._index);
    } else if (end !== -1) {
      value = this._buf.toString(this._encoding, this._index, end);
    }

    if (!peek)
      this._index = end + 1;

    return value;
  }

  skip(n = 1) {
    for (let i = 0; i < n; i++)
      this.next();

    return this;
  }

  peek() {
    return this.next(true);
  }

  stream() {
    let next = this.next.bind(this);

    return new Readable({
      read(n) {
        let data;

        while (data = next())
          this.push(data);

        this.push(null);
      }
    });
  }

  static readFile(file, options) {
    return new Promise((resolve, reject) => {
      readFile(file, (err, buf) => {
        if (err)
          return reject(err);

        resolve(new BufferNexter(buf, options));
      });
    });
  }
}
