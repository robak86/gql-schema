import * as _ from 'lodash';
import {Maybe} from "./types";

export function isPresent<T>(val:T | void | null | undefined):val is T {
    return !!val || (val as any) === 0;
}

export function someOrThrow<T>(fn:(() => Maybe<T>) | Maybe<T>, errorMsg:string):T | never {
    let val:T = (_.isFunction(fn) ? fn() : fn) as any;
    if (!isPresent(val)) {
        throw new Error(errorMsg)
    } else {
        return val;
    }
}

export function invariant(condition:boolean, message:string) {
    if (!condition) {
        let error = new Error(
            `Invariant Violation: ${message}`
        );

        (error as any).framesToPop = 1;
        throw new Error(message);
    }
}

export function noop() {}