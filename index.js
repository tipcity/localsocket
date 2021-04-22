/*! localsocket. MIT License. */
module.exports = LocalSocket

const randomSequentialId = () => new Date().getTime().toString(36)

function LocalSocket (name) {
  this.callbacks = []
  this.keys = {}

  if (name) this.name = name
  if (!this) {
    throw new Error(
      " Failed to construct 'localSocket': Please use the 'new' operator, this object constructor cannot be called as a function."
    )
  }

  this.connections = []
  this.connectionId = randomSequentialId()

  this.connected = true
  this.on = (event, cb) => {
    const key = randomSequentialId()
    if (!this.connected) return
    const isList = Array.isArray(event)
    const cbObj = {
      event: isList ? event.map((e) => e.trim()).join(' ') : String(event),
      cb: typeof cb === 'function' ? cb : () => {},
      callable: true,
      key,
      callType: 'on',
      callsCount: 0,
      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: event.length,
        matchCount: 0,
        order: 'loose',
        registered: ''
      })
    }
    this.callbacks.push(cbObj)

    this.keys[key] = cbObj

    return key
  }

  this.onOrderOf = (event, cb) => {
    if (!this.connected) return
    const isList = Array.isArray(event)
    return this.callbacks.push({
      event: isList ? event.map((e) => e.trim()).join(' ') : String(event),
      cb: typeof cb === 'function' ? cb : () => {},
      callable: true,
      callType: 'on',
      callsCount: 0,

      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: event.length,
        matchCount: 0,
        order: 'strict',
        registered: ''
      })
    })
  }
  this.onceOrderOf = (event, cb) => {
    if (!this.connected) return
    const isList = Array.isArray(event)
    return this.callbacks.push({
      event: isList ? event.map((e) => e.trim()).join(' ') : String(event),
      cb: typeof cb === 'function' ? cb : () => {},
      callable: true,
      callType: 'once',
      callsCount: 0,

      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: event.length,
        matchCount: 0,
        order: 'strict',
        registered: ''
      })
    })
  }

  this.once = (event, cb) => {
    if (!this.connected) return

    const isList = Array.isArray(event)
    return this.callbacks.push({
      event: isList ? event.map((e) => e.trim()).join(' ') : String(event),
      cb,
      callable: true,
      isTrainOfEvent: isList,
      callType: 'once',
      callsCount: 0,

      ...(isList && {
        eventCount: event.length,
        matchCount: 0,
        registered: '',
        sink: {}
      })
    })
  }

  this.emit = (event, args) => {
    if (!this.connected) return

    for (const c of this.callbacks) {
      const eventMatch = !c.isTrainOfEvent
        ? c.event === event
        : String(c.registered + ` ${event}`).trim() === c.event

      // console.log({ event, eventMatch, c })

      if (c.isTrainOfEvent) {
        if (c.order === 'strict' && !eventMatch) {
          if (String(c.event).includes(String(c.registered + ` ${event}`).trim())) {
            //
          } else {
            c.sink = {}
            c.registered = ''
          }
        }
      }

      if (eventMatch && c.callable && c.cb && typeof c.cb === 'function') {
        if (c.callType === 'on') {
          c.isTrainOfEvent ? c.cb({ ...c.sink, [event]: args }) : c.cb(args)
          c.callsCount = c.callsCount + 1
          c.sink = {}
        } else if (c.callType === 'once' && !c.called) {
          c.called = true
          c.callsCount = c.callsCount + 1
          c.isTrainOfEvent ? c.cb({ ...c.sink, [event]: args }) : c.cb(args)
        }
      }

      if (!eventMatch && c.isTrainOfEvent) {
        if (c.event.includes(event)) c.sink = { ...c.sink, [event]: args }
        const currentRegister = c.registered
        const firstRegister = !c.registered
        if (firstRegister) {
          if (c.event.startsWith(event)) { c.registered = String(event).trim() }
        } else {
          if (c.event.includes(currentRegister + ` ${event}`)) {
            c.registered =
                currentRegister + ` ${String(event).trim()}`
          }
        }
      } else if (c.isTrainOfEvent) {
        c.sink = {}
        c.registered = ''
      }
    }
  }
  this.off = (key) => {
    this.remove(key)
  }
  this.reOn = (key) => {
    if (!key) return
    if (!this.keys[key]) return

    this.callbacks = this.callbacks.concat(this.keys[key])
  }
  this.connect = () => {
    this.connected = true
    this.emit('connect', {
      connectionId: this.connectionId,
      connections: this.connections,
      connected: this.connected
    })
  }

  this.disconnect = () => {
    if (!this.connected) return
    this.connected = false
    this.emit('disconnect', {
      connectionId: this.connectionId,
      connections: this.connections,
      connected: this.connected
    })
  }

  this.remove = (key) => {
    if (!key) return
    if (!this.keys[key]) return

    this.callbacks = this.callbacks.filter(cb => cb.key !== key)
  }

  this.drop = () => {
    this.keys = {}
    this.callbacks = []
  }

  return this.emit('connect', {
    connectionId: this.connectionId,
    connections: this.connections,
    connected: this.connected
  })
}
