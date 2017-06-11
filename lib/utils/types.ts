export interface Type<T> {
    new(...args:any[]):T;
}

export type Partial<T> = {[P in keyof T]?: T[P]};
export type Maybe<T> = T | null | void;
