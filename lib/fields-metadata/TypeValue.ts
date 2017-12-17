import {Thunk} from "graphql";
import {resolveThunk} from "../utils/graphql";

export class TypeValue<T> {
    private _type:T;
    private _typeThunk:Thunk<T>;

    setType(type:T) {
        this._type = type;
    }

    setTypeThunk(typeThunk:Thunk<T>) {
        this._typeThunk = typeThunk;
    }

    inferType() {
        return this._type || resolveThunk(this._typeThunk);
    }
}