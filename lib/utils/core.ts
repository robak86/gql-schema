import * as _ from 'lodash';
import {Maybe} from "./types";

export function isPresent<T>(val:T | void | null | undefined):val is T {
    return (typeof val !== 'undefined') && (val !== null) && (!_.isNumber(val) || !isNaN(val))
}

export function someOrThrow<T>(fn:(() => Maybe<T>) | Maybe<T>, errorMsg:string):T|never {
    let val:T = (_.isFunction(fn) ? fn() : fn) as any;
    if (!isPresent(val)) {
        throw new Error(errorMsg)
    } else {
        return val;
    }
}

export function invariant(condition:boolean | (() => boolean), message:string) {
    if ((_.isFunction(condition) && (!condition())) || !condition) {
        throw new Error(message);
    }
}