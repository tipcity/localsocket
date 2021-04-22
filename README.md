# LocalSocket [![ci][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[ci-image]: https://img.shields.io/github/workflow/status/conquext/localsocket/ci/master
[ci-url]: https://github.com/conquext/localsocket/actions
[npm-image]: https://img.shields.io/npm/v/localsocket.svg
[npm-url]: https://npmjs.org/package/localsocket
[downloads-image]: https://img.shields.io/npm/dm/localsocket.svg
[downloads-url]: https://npmjs.org/package/localsocket
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

### Event Emitters for everybody


### install

```
npm install @tipcity/localsocket `or` yarn install @tipcity/localsocket
```

### usage

#### localsocket.on(connected, [callback])

Listen and react to `events` within a sandbox. When a listener is registered,
it is queued up in an array of suspended rections. Once an `event` is received,
all the registered callbacks are invoked in order.

It is also possible to pass a sequence of `events` in order. If the events
are received in that order, the registerd callback is invoked. 

##### arguments

- `tasks` - An array or object containing functions to run. Each function is passed a
`callback(err, result)` which it must call on completion with an error `err` (which can
be `null`) and an optional `result` value.
- `callback(err, results)` - An optional callback to run once all the functions have
completed. This function gets a results array (or object) containing all the result
arguments passed to the task callbacks.

##### example

```js
var LocalSocket = require('@tipcity/localsocket')

testingEvent = new LocalSocket("test");

testingEvent.connect(); // manually connect to localsocket
testingEvent.disconnect(); // manually disconnect from localsocket
testingEvent.on('foo', () => {}); // trigger alawys
testingEvent.once('bar', () => {}); // trigger only once 
testingEvent.on('foo bar baz', () => {}); // when the three events are executed in this order, will ignore other events in between
testingEvent.onOrderOf('foo bar baz', () => {}); // called always when the three events must have happened sequentially without a break
testingEvent.onceOrderOf('foo bar baz', () => {}); // called only once when the three events must have happened sequentially without a break
```

Works in all javascript environment

### license

MIT. Copyright (c) [Tipcity](http://tipcity.co).
