"use strict";
/*! localsocket. MIT License. */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// declare class LocalSocket {
//   constructor(name?: string);
// }
var randomSequentialId = function () { return new Date().getTime().toString(36); };
/**
 * @constructor
 * @this LocalSocket
 * @description Manages the event within a sandbox
 * @param name (optional) Name of the LocalSocket instance
 */
var LocalSocket = function (name) {
    this.callbacks = [];
    this.keys = {};
    this.maxListeners = undefined;
    this.events = {};
    if (name)
        this.name = name;
    if (!this) {
        throw new Error(" Failed to construct 'localSocket': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }
    this.connections = [];
    this.connectionId = randomSequentialId();
    this.connected = true;
    this.validate = function (event) {
        var _this = this;
        if (!this.connected) {
            //   console.warn(`[LocalSocket]: Discarding...${([] as EventType[]).concat(event).join(" ")}, Instance is disconnected`);
            console.warn("[LocalSocket]: Instance is disconnected");
            //   return;
        }
        if (this.maxListeners) {
            var listnersCount = this.callbacks.length;
            if (listnersCount >= this.maxListeners) {
                throw new Error("[LocalSocket]: Max listener limit reached");
            }
            if (listnersCount > 5 && this.maxListeners - listnersCount < 5) {
                console.warn("[LocalSocket]: listeners approaching limit");
            }
        }
        [].concat(event).forEach(function (event) {
            if (_this.events[event] && _this.events[event].maxListeners) {
                var listnersCount = _this.events.count;
                if (listnersCount >= _this.events[event].maxListeners) {
                    throw new Error("[LocalSocket]: Max listener limit reached for " + String(event));
                }
                if (listnersCount > 5 &&
                    _this.events[event].maxListeners - listnersCount < 5) {
                    console.warn("[LocalSocket]: isteners approaching limit for " + String(event));
                }
            }
        });
        return true;
    };
    this.limitConnections = function (value) {
        if (typeof value !== "number") {
            throw new Error("[LocalSocket]: Expects value to be a number");
        }
        if (!value) {
            throw new Error("[LocalSocket]: Max listeners must be greater than zero");
        }
        this.maxListeners = parseInt(String(value));
    };
    this.setEventMaxListener = function (eventName, value) {
        if (typeof eventName !== "string" || typeof value !== "number") {
            throw new Error("[LocalSocket]: Expects event name to be a string and value to be a number");
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
    /**
     * @description Trigger always when a sequence of events are emitted loosely in order
     * @param event A string, symbol of an array of events to register
     * @param cb The callback function to evoke when the events are observed
     * @returns A reference key of the listener
     */
    this.on = function (event, cb) {
        var validState = this.validate(event);
        if (!validState)
            return;
        var key = randomSequentialId();
        var isList = Array.isArray(event);
        var cbObj = __assign({ event: isList
                ? []
                    .concat(event)
                    .map(function (e) { return String(e).trim(); })
                    .join(" ")
                : String(event), cb: typeof cb === "function" ? cb : function () { }, callable: true, key: key, callType: "on", callsCount: 0, isTrainOfEvent: isList }, (isList && {
            eventCount: [].concat(event).length,
            matchCount: 0,
            order: "loose",
            registered: "",
        }));
        this.callbacks.push(cbObj);
        this.keys[key] = cbObj;
        var stringigiedEvent = [].concat(event).join(" ");
        if (this.events[stringigiedEvent]) {
            this.events[stringigiedEvent].count =
                this.events[stringigiedEvent].count + 1;
        }
        else {
            this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
        }
        return key;
    };
    /**
     * @description Trigger always when a sequence of events are emitted strictly in order
     * @param event A string, symbol of an array of events to register
     * @param cb The callback function to evoke when the events are observed
     * @returns A reference key of the listener
     */
    this.onOrderOf = function (event, cb) {
        var validState = this.validate(event);
        if (!validState)
            return;
        var isList = Array.isArray(event);
        var key = randomSequentialId();
        var cbObj = __assign({ event: isList
                ? []
                    .concat(event)
                    .map(function (e) { return String(e).trim(); })
                    .join(" ")
                : String(event), cb: typeof cb === "function" ? cb : function () { }, callable: true, callType: "on", callsCount: 0, isTrainOfEvent: isList }, (isList && {
            eventCount: [].concat(event).length,
            matchCount: 0,
            order: "strict",
            registered: "",
            sink: {},
        }));
        this.callbacks.push(cbObj);
        this.keys[key] = cbObj;
        var stringigiedEvent = [].concat(event).join(" ");
        if (this.events[stringigiedEvent]) {
            this.events[stringigiedEvent].count =
                this.events[stringigiedEvent].count + 1;
        }
        else {
            this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
        }
        return key;
    };
    /**
     * @description Trigger at most once when a sequence of events are emitted strictly in order
     * @param event A string, symbol of an array of events to register
     * @param cb The callback function to evoke when the events are observed
     * @returns A reference key of the listener
     */
    this.onceOrderOf = function (event, cb) {
        var validState = this.validate(event);
        if (!validState)
            return;
        var isList = Array.isArray(event);
        var key = randomSequentialId();
        var cbObj = __assign({ event: isList
                ? []
                    .concat(event)
                    .map(function (e) { return String(e).trim(); })
                    .join(" ")
                : String(event), cb: typeof cb === "function" ? cb : function () { }, key: key, callable: true, callType: "once", callsCount: 0, isTrainOfEvent: isList }, (isList && {
            eventCount: [].concat(event).length,
            matchCount: 0,
            order: "strict",
            registered: "",
            sink: {},
        }));
        this.keys[key] = cbObj;
        this.callbacks.push(cbObj);
        var stringigiedEvent = [].concat(event).join(" ");
        if (this.events[stringigiedEvent]) {
            this.events[stringigiedEvent].count =
                this.events[stringigiedEvent].count + 1;
        }
        else {
            this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
        }
        return key;
    };
    /**
     * @description Trigger at most once when a sequence of events are emitted loosely in order
     * @param event A string, symbol of an array of events to register
     * @param cb The callback function to evoke when the events are observed
     * @returns A reference key of the listener
     */
    this.once = function (event, cb) {
        var validState = this.validate(event);
        if (!validState)
            return;
        var isList = Array.isArray(event);
        var key = randomSequentialId();
        var cbObj = __assign({ event: isList
                ? []
                    .concat(event)
                    .map(function (e) { return String(e).trim(); })
                    .join(" ")
                : String(event), cb: typeof cb === "function" ? cb : function () { }, callable: true, key: key, callType: "once", callsCount: 0, isTrainOfEvent: isList }, (isList && {
            eventCount: [].concat(event).length,
            matchCount: 0,
            order: "loose",
            registered: "",
            sink: {},
        }));
        this.callbacks.push(cbObj);
        this.keys[key] = cbObj;
        var stringigiedEvent = [].concat(event).join(" ");
        if (this.events[stringigiedEvent]) {
            this.events[stringigiedEvent].count =
                this.events[stringigiedEvent].count + 1;
        }
        else {
            this.events[stringigiedEvent] = { maxListeners: undefined, count: 1 };
        }
        return key;
    };
    /**
     * @description Dispatch an event
     */
    this.emit = function (event, args) {
        var _a, _b, _c;
        if (!this.connected) {
            console.warn("[LocalSocket]: Discarding..." + []
                .concat(event)
                .join(" ") + ", " + (this.name ? this.name : "LocalSocket") + " Instance is disconnected");
            return;
        }
        for (var _i = 0, _d = this.callbacks; _i < _d.length; _i++) {
            var c = _d[_i];
            var eventMatch = !c.isTrainOfEvent
                ? c.event === event
                : String(c.registered + (" " + String(event))).trim() === c.event;
            if (c.isTrainOfEvent) {
                if (c.order === "strict" && !eventMatch) {
                    if (String(c.event).includes(String(c.registered + (" " + String(event))).trim())) {
                        //
                    }
                    else {
                        c.sink = {};
                        c.registered = "";
                    }
                }
            }
            if (eventMatch && c.callable && c.cb && typeof c.cb === "function") {
                if (c.callType === "on") {
                    c.isTrainOfEvent ? c.cb(__assign(__assign({}, c.sink), (_a = {}, _a[event] = args, _a))) : c.cb(args);
                    c.callsCount = c.callsCount + 1;
                    c.sink = {};
                }
                else if (c.callType === "once" && !c.called) {
                    c.called = true;
                    c.callsCount = c.callsCount + 1;
                    c.isTrainOfEvent ? c.cb(__assign(__assign({}, c.sink), (_b = {}, _b[event] = args, _b))) : c.cb(args);
                }
            }
            if (!eventMatch && c.isTrainOfEvent) {
                if (c.event.includes(event))
                    c.sink = __assign(__assign({}, c.sink), (_c = {}, _c[event] = args, _c));
                var currentRegister = c.registered;
                var firstRegister = !c.registered;
                if (firstRegister) {
                    if (c.event.startsWith(event)) {
                        c.registered = String(event).trim();
                    }
                }
                else {
                    if (c.event.includes(currentRegister + (" " + String(event)))) {
                        c.registered = currentRegister + (" " + String(event).trim());
                    }
                }
            }
            else if (c.isTrainOfEvent) {
                c.sink = {};
                c.registered = "";
            }
        }
    };
    /**
     * @description Disconnect a listener
     * @param key Idenitifies the listener to disconnect
     */
    this.off = function (key) {
        this.remove(key);
    };
    /**
     * @description Reconnect a listener
     * @param key Identifies the listner to reconnect
     */
    this.reOn = function (key) {
        if (!key)
            return;
        if (!this.keys[key])
            return;
        this.callbacks = this.callbacks.concat(this.keys[key]);
    };
    this.connect = function () {
        this.connected = true;
        this.emit("connect", {
            connectionId: this.connectionId,
            connections: this.connections,
            connected: this.connected,
        });
    };
    this.disconnect = function () {
        if (!this.connected)
            return;
        this.connected = false;
        this.emit("disconnect", {
            connectionId: this.connectionId,
            connections: this.connections,
            connected: this.connected,
        });
    };
    this.remove = function (key) {
        if (!key)
            return;
        if (!this.keys[key])
            return;
        delete this.events[key];
        this.callbacks = this.callbacks.filter(function (cb) { return cb.key !== key; });
    };
    this.drop = function () {
        this.keys = {};
        this.callbacks = [];
        this.events = {};
        // this.maxListeners = undefined
    };
    //   this.connect = function(_url?:string) {};
    //   this.emit("connect", {
    //     connectionId: this.connectionId,
    //     connections: this.connections,
    //     connected: this.connected,
    //   });
    // return this;
};
exports.default = LocalSocket;
