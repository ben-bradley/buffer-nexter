# Buffer Nexter

## About

Buffer Nexter will allow you to manually iterate a buffer based on an arbitrary separator (defaulting to `\n`).  Alternatively, you can stream the buffer based on the same separator.  The `next()` method behaves very similarly to an ES6 generator.

## Use

```javascript
import BufferNexter from 'buffer-nexter';

let lines = new Buffer('line1\nline2\line3');

let buf = new BufferNexter(lines);

console.log(buf.next()); // -> line1
console.log(buf.next()); // -> line2
console.log(buf.next()); // -> line3
console.log(buf.next()); // -> null
```

## `new BufferNexter(buffer[, options])`

### `buffer` (Buffer)

A standard buffer, typically a String, containing some value to use as a separator to iterate with.

### `options` (Object, optional)

- `separator` - The string value to use for iteration, default `\n`.
- `index` - The buffer index within the buffer to begin iteration, default `0`.
- `encoding` - The encoding type to use to read the buffer, default `utf8`.

### Code

```javascript
let buf = new BufferNexter('1,2,3', { separator: ',' });

console.log(buf.next()); // -> 1
console.log(buf.next()); // -> 2
console.log(buf.next()); // -> 3
console.log(buf.next()); // -> null
```

## Methods

### `next()`

Calling `next()` will return the 'next' value from the provided buffer.

### `skip(n)`

This will call `next()` 'n' times and return `this` so you can chain `next()` calls.

### `peek()`

This will give you a look at the 'next' value that will be returned on the subsequent `next()` call.

### `stream()`

This returns a `Readable` stream for piping or whatever you want to use a stream for.  The stream emits `data` events for each iteration of the buffer.
