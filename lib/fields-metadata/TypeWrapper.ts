import {GraphQLList, GraphQLNonNull, GraphQLType} from "graphql";
import {invariant} from "../utils/core";

export class TypeWrapper {
    private _isArray:boolean = false;
    private _isNonNull:boolean = false;
    private _hasNonNullItems:boolean = false;

    setArray() {
        this._isArray = true;
    }

    setNonNullConstraint() {
        this._isNonNull = true;
    }

    setNonNullItemsConstraint() {
        this._hasNonNullItems = true;
    }

    wrap(type:GraphQLType):GraphQLType {
        invariant(!(this._hasNonNullItems && !this._isArray), `@nonNullItems used without @list decorator is not supported`);

        if (this._hasNonNullItems && this._isArray) {
            type = new GraphQLList(new GraphQLNonNull(type))
        }

        if (!this._hasNonNullItems && this._isArray) {
            type = new GraphQLList(type)
        }

        if (this._isNonNull) {
            type = new GraphQLNonNull(type);
        }

        return type;
    }
}