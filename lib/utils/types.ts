export interface Type<T> {
    new(...args:any[]):T;
}

export type Maybe<T> = T | null | void;
