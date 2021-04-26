/*! localsocket. MIT License. */


export default LocalSocket;

const randomSequentialId = () => new Date().getTime().toString(36);

type EventKey = string | symbol;
type EventType = string | symbol;

type Fn = (...arg: any) => any;

type CallbackObject = {
  eventCount: any;
  matchCount: number;
  order: string;
  registered: string;
  event: any;
  cb: any;
  callable: boolean;
  key: string;
  callType: string;
  callsCount: number;
  isTrainOfEvent: boolean;
};

interface LocalSocket {
  connected: boolean;
  connectionId: string | symbol;
  connections: string[];
  callbacks: CallbackObject[];
  keys: Record<EventKey, any>;
  maxListeners?: number;
  validate: (event: EventType | EventType[]) => boolean | undefined;
  setEventMaxListener: (event: EventType, value: number) => void;
  on: (event: EventType | EventType[], cb: Fn) => string | undefined;
  once: (event: EventType | EventType[], cb: Fn) => string | undefined;
  onceOrderOf: (event: EventType | EventType[], cb: Fn) => string | undefined;
  onOrderOf: (event: EventType[], cb: Fn) => string | undefined;
  events: Record<string | symbol, any>;
  off: (key: EventKey) => void;
  emit: (event: EventType, args: any) => void;
  reOn: (key: EventKey) => void;
  connect: () => void;
  disconnect: () => void;
  remove: (key: EventKey) => void;
  drop: () => void;
}

type Events = string[];

/**
 * @constructor
 * @this LocalSocket
 */
function LocalSocket(name?:string): LocalSocket {
  this.callbacks = [];
  this.keys = {};
  this.maxListeners = undefined;
  this.events = {};

  if (name) this.name = name;
  if (!this) {
    throw new Error(
      " Failed to construct 'localSocket': Please use the 'new' operator, this object constructor cannot be called as a function."
    );
  }

  this.connections = [];
  this.connectionId = randomSequentialId();

  this.connected = true;

  this.validate = function(event: EventType | EventType[]) {
    if (!this.connected) {
    //   console.warn(`[LocalSocket]: Discarding...${([] as EventType[]).concat(event).join(" ")}, Instance is disconnected`);
      console.warn(`[LocalSocket]: Instance is disconnected`);
    //   return;
    }
    if (this.maxListeners) {
      const listnersCount = this.callbacks.length;
      if (listnersCount >= this.maxListeners) {
        throw new Error("[LocalSocket]: Max listener limit reached");
      }
      if (listnersCount > 5 && this.maxListeners - listnersCount < 5) {
        console.warn("[LocalSocket]: listeners approaching limit");
      }
    }

    ([] as EventType[]).concat(event).forEach((event: EventType) => {
      if (this.events[event as string] && this.events[event].maxListeners) {
        const listnersCount = this.events.count;
        if (listnersCount >= this.events[event].maxListeners) {
          throw new Error(
            `[LocalSocket]: Max listener limit reached for ${String(event)}`
          );
        }
        if (
          listnersCount > 5 &&
          this.events[event].maxListeners - listnersCount < 5
        ) {
          console.warn(
            `[LocalSocket]: isteners approaching limit for ${String(event)}`
          );
        }
      }
    });
    return true;
  };
  
  this.limitConnections = function (value: number) {
    if (typeof value !== "number") {
      throw new Error("[LocalSocket]: Expects value to be a number");
    }
    if (!value) {
      throw new Error("[LocalSocket]: Max listeners must be greater than zero");
    }
    this.maxListeners = parseInt(String(value));
  };

  this.setEventMaxListener = function (eventName: string, value: number) {
    if (typeof eventName !== "string" || typeof value !== "number") {
      throw new Error(
        "[LocalSocket]: Expects event name to be a string and value to be a number"
      );
    }
    if (!value) {
      throw new Error("[LocalSocket]: Max listeners must be greater than zero");
    }
    if (!this.events[eventName]) {
      console.warn("[LocalSocket]: evemt was never registered");
      return;
    }
    this.events[eventName].maxListeners = parseInt(String(value));
  };
  
  this.on = function(event: EventType | EventType[], cb:Fn) {
    const validState = this.validate(event);
    if(!validState) return;
    const key = randomSequentialId();
    
    const isList = Array.isArray(event);
    const cbObj = {
      event: isList
        ? ([] as EventType[])
            .concat(event)
            .map((e: EventType) => String(e).trim())
            .join(" ")
        : String(event),
      cb: typeof cb === "function" ? cb : () => {},
      callable: true,
      key,
      callType: "on",
      callsCount: 0,
      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: ([] as EventType[]).concat(event).length,
        matchCount: 0,
        order: "loose",
        registered: "",
      }),
    };
    this.callbacks.push(cbObj);

    this.keys[key] = cbObj;

     const stringigiedEvent = ([] as EventType[]).concat(event).join(" ");
    if (this.events[stringigiedEvent]) {
      this.events[stringigiedEvent].count = this.events[stringigiedEvent].count + 1;
    } else {
      this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
    }

    return key;
  };

  this.onOrderOf = function(event:EventType, cb:Fn) {
    const validState = this.validate(event);
    if (!validState) return;
    const isList = Array.isArray(event);
        const key = randomSequentialId();

        const cbObj = {
          event: isList
            ? ([] as EventType[])
                .concat(event)
                .map((e: EventType) => String(e).trim())
                .join(" ")
            : String(event),
          cb: typeof cb === "function" ? cb : () => {},
          callable: true,
          callType: "on",
          callsCount: 0,
          isTrainOfEvent: isList,
          ...(isList && {
            eventCount: ([] as EventType[]).concat(event).length,
            matchCount: 0,
            order: "strict",
            registered: "",
            sink: {}
          }),
        };

    this.callbacks.push(cbObj);

     this.keys[key] = cbObj;

     const stringigiedEvent = ([] as EventType[]).concat(event).join(" ");
     if (this.events[stringigiedEvent]) {
       this.events[stringigiedEvent].count =
         this.events[stringigiedEvent].count + 1;
     } else {
       this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
     }

     return key;
  };
  this.onceOrderOf = function(event:EventType, cb:Fn) {
    const validState = this.validate(event);
    if (!validState) return;

    const isList = Array.isArray(event);
        const key = randomSequentialId();

    const cbObj = {
      event: isList
        ? ([] as EventType[])
            .concat(event)
            .map((e: EventType) => String(e).trim())
            .join(" ")
        : String(event),
      cb: typeof cb === "function" ? cb : () => {},
      key,
      callable: true,
      callType: "once",
      callsCount: 0,
      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: ([] as EventType[]).concat(event).length,
        matchCount: 0,
        order: "strict",
        registered: "",
        sink: {}
      }),
    };
     this.keys[key] = cbObj;
        this.callbacks.push(cbObj);

     const stringigiedEvent = ([] as EventType[]).concat(event).join(" ");
     if (this.events[stringigiedEvent]) {
       this.events[stringigiedEvent].count =
         this.events[stringigiedEvent].count + 1;
     } else {
       this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
     }

     return key;
  };

  this.once = function (event: EventType | EventType[], cb: Fn) {
    const validState = this.validate(event);
    if (!validState) return;

    const isList = Array.isArray(event);
        const key = randomSequentialId();

    const cbObj = {
      event: isList
        ? ([] as EventType[])
            .concat(event)
            .map((e:EventType) => String(e).trim())
            .join(" ")
        : String(event),
      cb: typeof cb === "function" ? cb : () => {},
      callable: true,
      key,
      callType: "once",
      callsCount: 0,
      isTrainOfEvent: isList,
      ...(isList && {
        eventCount: ([] as EventType[]).concat(event).length,
        matchCount: 0,
        order: "loose",
        registered: "",
        sink: {},
      }),
    };
    this.callbacks.push(cbObj);

    this.keys[key] = cbObj;

     const stringigiedEvent = ([] as EventType[]).concat(event).join(" ");
     if (this.events[stringigiedEvent]) {
       this.events[stringigiedEvent].count =
         this.events[stringigiedEvent].count + 1;
     } else {
       this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
     }

     return key;
    
  };

  this.emit = function (event: EventType, args:any) {
    if (!this.connected) {
            console.warn(
              `[LocalSocket]: Discarding...${([] as EventType[])
                .concat(event)
                .join(" ")}, ${this.name ? this.name : 'LocalSocket'} Instance is disconnected`
            );

      return;
    }
    for (const c of this.callbacks) {
      const eventMatch = !c.isTrainOfEvent
        ? c.event === event
        : String(c.registered + ` ${String(event)}`).trim() === c.event;

      if (c.isTrainOfEvent) {
        if (c.order === "strict" && !eventMatch) {
          if (
            String(c.event).includes(String(c.registered + ` ${String(event)}`).trim())
          ) {
            //
          } else {
            c.sink = {};
            c.registered = "";
          }
        }
      }

      if (eventMatch && c.callable && c.cb && typeof c.cb === "function") {
        if (c.callType === "on") {
          c.isTrainOfEvent ? c.cb({ ...c.sink, [event]: args }) : c.cb(args);
          c.callsCount = c.callsCount + 1;
          c.sink = {};
        } else if (c.callType === "once" && !c.called) {
          c.called = true;
          c.callsCount = c.callsCount + 1;
          c.isTrainOfEvent ? c.cb({ ...c.sink, [event]: args }) : c.cb(args);
        }
      }

      if (!eventMatch && c.isTrainOfEvent) {
        if (c.event.includes(event)) c.sink = { ...c.sink, [event]: args };
        const currentRegister = c.registered;
        const firstRegister = !c.registered;
        if (firstRegister) {
          if (c.event.startsWith(event)) {
            c.registered = String(event).trim();
          }
        } else {
          if (c.event.includes(currentRegister + ` ${String(event)}`)) {
            c.registered = currentRegister + ` ${String(event).trim()}`;
          }
        }
      } else if (c.isTrainOfEvent) {
        c.sink = {};
        c.registered = "";
      }
    }
  };
  this.off = function(key:string) {
    this.remove(key);
  };
  this.reOn = function(key:string) {
    if (!key) return;
    if (!this.keys[key]) return;

    this.callbacks = this.callbacks.concat(this.keys[key]);
  };
  this.connect = function() {
    this.connected = true;
    this.emit("connect", {
      connectionId: this.connectionId,
      connections: this.connections,
      connected: this.connected,
    });
  };

  this.disconnect = function() {
    if (!this.connected) return;
    this.connected = false;
    this.emit("disconnect", {
      connectionId: this.connectionId,
      connections: this.connections,
      connected: this.connected,
    });
  };

  this.remove = function(key: EventKey){
    if (!key) return;
    if (!this.keys[key]) return;
    delete this.events[key];

    this.callbacks = this.callbacks.filter((cb:CallbackObject) => cb.key !== key);
  };

  this.drop = function() {
    this.keys = {};
    this.callbacks = [];
    this.events = {};
    // this.maxListeners = undefined
  };

//   this.connect = function(_url?:string) {};
  
  return this.emit("connect", {
    connectionId: this.connectionId,
    connections: this.connections,
    connected: this.connected,
  });
}
