export interface ClassType<T> {
    new(...args:any[]):T;
}

export type Maybe<T> = T | null | void;
