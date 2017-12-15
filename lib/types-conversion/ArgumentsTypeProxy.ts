import {GraphQLFieldConfigArgumentMap, Thunk} from "graphql";

import * as _ from "lodash";
import {resolveThunk} from "../utils/graphql";
import {ParamsMetadata} from "../types-metadata/ParamsMetadata";
import {invariant} from "../utils/core";
import {ClassType} from "../utils/types";

export type ArgsType =
    GraphQLFieldConfigArgumentMap |
    ClassType<any>

export class ArgumentsTypeProxy {
    private _type:ArgsType;
    private _typeThunk:Thunk<ArgsType>;

    setType(type:ArgsType) {
        this._type = type;
    }

    setTypeThunk(typeThunk:Thunk<ArgsType>) {
        this._typeThunk = typeThunk;
    }

    toGraphQLType():GraphQLFieldConfigArgumentMap {
        let type = (this._type || resolveThunk(this._typeThunk)) as GraphQLFieldConfigArgumentMap;

        if (_.isFunction(type)) {
            let metadata = ParamsMetadata.getForClass(type);
            invariant(!!metadata, `Missing ParamsMetadata for ${type}. Decorate class using @params decorator`);
            return metadata.toGraphQLFieldConfigArgumentMap();
        }

        throw new Error(`Cannot infer type for ${JSON.stringify(type)}`)
    }
}