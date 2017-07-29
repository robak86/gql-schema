import {Thunk} from "graphql";

export function resolveThunk<T>(thunk:Thunk<T>):T {
    return typeof thunk === 'function' ? thunk() : thunk;
}