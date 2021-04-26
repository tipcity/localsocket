/*! localsocket. MIT License. */
export declare type EventKey = string | symbol;
export declare type EventType = string | symbol;
declare type Fn = (...arg: any) => any;
declare type CallbackObject = {
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
export interface LocalSocket {
    name?: string | symbol;
    connected: boolean;
    connectionId: string | symbol;
    connections: string[];
    callbacks: CallbackObject[];
    keys: Record<EventKey, any>;
    maxListeners?: number;
    setEventMaxListener: (event: EventType, value: number) => void;
    limitConnections: (value: number) => void;
    validate: (event: EventType | EventType[]) => boolean | undefined;
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
/**
 * @constructor
 * @this LocalSocket
 * @description Manages the event within a sandbox
 * @param name (optional) Name of the LocalSocket instance
 */
declare const LocalSocket: new (name?: string | undefined) => LocalSocket;
export default LocalSocket;
