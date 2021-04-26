# LocalSocket [![ci][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[ci-image]: https://img.shields.io/github/workflow/status/tipcity/localsocket/ci
[ci-url]: https://github.com/tipcity/localsocket/actions
[npm-v]: https://img.shields.io/npm/v/@tipcity/localsocket
[dependencies]: https://img.shields.io/librariesio/github/tipcity/localsocket
[npm-image]: https://img.shields.io/npm/v/localsocket.svg
[npm-url]: https://npmjs.org/package/@tipcity/localsocket
[bundle-size]: https://img.shields.io/bundlephobia/min/@tipcity/localsocket
[downloads-image]: https://img.shields.io/npm/dm/localsocket.svg
[downloads-url]: https://img.shields.io/npm/dw/@tipcity/localsocket
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

### Event Emitters for everybody


### install

```
npm install @tipcity/localsocket `or` yarn add @tipcity/localsocket
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

localSocket = new LocalSocket("test");

localSocket.connect(); // manually connect to localsocket
localSocket.disconnect(); // manually disconnect from localsocket
localSocket.on('foo', () => {}); // trigger alawys, returns an eventKey
localSocket.once('bar', () => {}); // trigger only once 
localSocket.on(['foo bar baz'], () => {}); // when the three events are dispatched in this order, will ignore other events in between
localSocket.onOrderOf(['foo bar baz'], () => {}); // called always when the three events must have happened sequentially without a break
localSocket.onceOrderOf(['foo bar baz'], () => {}); // called only once when the three events must have happened sequentially without a break
localSocket.remove(eventKey); // remove a single listener from the register
localSocket.drop(); // drop the localsocket instance


localSocket.limitConnections(value); // set a max listener for this event. Throws an error, if a new listener is registered passed the limit
localSocket.setEventMaxListener(eventKey, value); // set a max listener for this event. Throws an error, if a new listener is registered passed the limit


```

Works in all javascript environment

### license

MIT. Copyright (c) [Tipcisty](http://app.tipcity.co).
