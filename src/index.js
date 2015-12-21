'use strict';

import { Readable } from 'stream';

export default class BufferNexter {
  constructor(buf, options = {}) {
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
      value = this._buf.toString(this._encoding, this._index, end);

    if (!peek)
      this._index = end + 1;

    this._done = (end === -1) ? true : this._done;

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
}
