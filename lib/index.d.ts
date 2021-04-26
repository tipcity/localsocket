/*! localsocket. MIT License. */
export default LocalSocket;
declare type EventKey = string | symbol;
declare type EventType = string | symbol;
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
/**
 * @constructor
 * @this LocalSocket
 */
declare function LocalSocket(name?: string): LocalSocket;
