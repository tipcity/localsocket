const LocalSocket = require('../lib/').default
const test = require('tape')

const localSocket = new LocalSocket()

function teardown (cb) {
  test('teardown', function (t) {
    localSocket.drop()
    t.end()
  })
}

test('always trigger on single event', function (t) {
  t.plan(4)

  let counter = 0
  localSocket.on('testA', function ({ event, secretValue }) {
    if (counter === 0) {
      t.equal(event, 'testA')
      t.equal(secretValue, 5)
      counter++
    } else {
      t.equal(event, 'testA')
      t.equal(secretValue, 6)
    }
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 5 })
  localSocket.emit('testA', { event: 'testA', secretValue: 6 })
})
teardown(test)

test('only triggers once on single event', function (t) {
  // if more than 3 assertions are tested then the test failed
  t.plan(3)

  let counter = 0
  localSocket.once('testC', function ({ event, secretValue }) {
    if (counter === 0) {
      t.equal(event, 'testC')
      t.equal(secretValue, 7)
      counter++
    } else {
      t.equal(event, 'testC')
      t.equal(secretValue, 8)
    }
  })

  localSocket.emit('testC', { event: 'testC', secretValue: 7 })
  localSocket.emit('testC', { event: 'testC', secretValue: 8 })

  setTimeout(function () {
    t.equal(typeof 's', 'string')
  }, 100)
})
teardown(test)

test('always triggers on chain of events', function (t) {
  t.plan(4)

  let counter = 0
  localSocket.on(['testA testB testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })
})
teardown(test)

test('only triggers once on chain of events', function (t) {
  t.plan(2)

  let counter = 0
  localSocket.once(['testA testB testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })
})
teardown(test)

test('will not trigger if not exact chain of events', function (t) {
  t.plan(1)

  let counter = 0
  localSocket.onOrderOf(['testA testB testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })

  t.equal(typeof 's', 'string')
})
teardown(test)

test('always triggers only on exact chain of events', function (t) {
  t.plan(4)

  let counter = 0
  localSocket.onOrderOf(['testA testB testC testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else if (counter === 1) {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })
})
teardown(test)

test('only triggers once on exact chain of events', function (t) {
  t.plan(2)

  let counter = 0
  localSocket.onceOrderOf(['testA testB testC testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else if (counter === 1) {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })
})
teardown(test)

test('will not trigger after disconnect', function (t) {
  t.plan()

  let counter = 0
  localSocket.disconnect()
  localSocket.onceOrderOf(['testA testB testC testD'], function (sink) {
    const { testA, testD } = sink

    const { event: eventA, secretValue: secretValueA } = testA
    const { event, secretValue } = testD

    if (counter === 0) {
      t.equal(event, 'testD')
      t.equal(secretValue, 10)
    } else if (counter === 1) {
      t.equal(eventA, 'testA')
      t.equal(secretValueA, 17)
    }
    counter++
  })

  localSocket.emit('testA', { event: 'testA', secretValue: 7 })
  localSocket.emit('testB', { event: 'testB', secretValue: 8 })
  localSocket.emit('testC', { event: 'testC', secretValue: 9 })
  localSocket.emit('testD', { event: 'testD', secretValue: 10 })

  localSocket.emit('testA', { event: 'testA', secretValue: 17 })
  localSocket.emit('testB', { event: 'testB', secretValue: 18 })
  localSocket.emit('testC', { event: 'testC', secretValue: 19 })
  localSocket.emit('testD', { event: 'testD', secretValue: 20 })

  t.end()
})

test('will trigger after reconnect', function (t) {
  t.plan(2)

  localSocket.connect()
  localSocket.on('testA', function ({ event, secretValue }) {
    t.equal(event, 'testA')
    t.equal(secretValue, 2)
  })
  localSocket.emit('testA', { event: 'testA', secretValue: 2 })
})
teardown(test)

test('will not trigger after unsubscribe', function (t) {
  t.plan(2)

  const sub = localSocket.on('testA', function ({ event, secretValue }) {
    t.equal(event, 'testA')
    t.equal(secretValue, 2)
  })
  localSocket.emit('testA', { event: 'testA', secretValue: 2 })

  localSocket.off(sub)

  localSocket.emit('testA', { event: 'testA', secretValue: 5 })
})
teardown(test)

test('will trigger after reconnect', function (t) {
  t.plan(4)

  let counter = 0
  const sub = localSocket.on('testA', function ({ event, secretValue }) {
    if (counter === 0) {
      t.equal(event, 'testA')
      t.equal(secretValue, 2)
    } else if (counter === 1) {
      t.equal(event, 'testA')
      t.equal(secretValue, 5)
    }
    counter++
  })
  localSocket.emit('testA', { event: 'testA', secretValue: 2 })

  localSocket.off(sub)

  localSocket.emit('testA', { event: 'testA', secretValue: 5 })

  localSocket.reOn(sub)

  localSocket.emit('testA', { event: 'testA', secretValue: 5 })
})
teardown(test)
