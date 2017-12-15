import {enumsRegistry} from "../registry/typesRegistry";
import {GraphQLType, isType, Thunk} from "graphql";
import * as _ from "lodash";
import {resolveThunk} from "../utils/graphql";
import {TypeMetadata} from "../types-metadata/TypeMetadata";
import {invariant} from "../utils/core";
import {getMetadata} from "../utils/metadata";
import {ParamsMetadata} from "../types-metadata/ParamsMetadata";
import {InterfaceTypeMetadata} from "../types-metadata/InterfaceTypeMetadata";
import {ClassType} from "../utils/types";

export type FieldType =
    GraphQLType |
    ClassType<any> |
    Object;

export class TypeProxy {
    static inferType(type:FieldType):GraphQLType {
        let proxy = new TypeProxy();
        proxy.setType(type);
        return proxy.toGraphQLType()
    }

    static inferTypeThunk(typeThunk:() => FieldType):GraphQLType {
        let proxy = new TypeProxy();
        proxy.setTypeThunk(typeThunk);
        return proxy.toGraphQLType()
    }

    private _type:FieldType;
    private _typeThunk:Thunk<FieldType>;

    setType(type:FieldType) {
        this._type = type;
    }

    setTypeThunk(typeThunk:Thunk<FieldType>) {
        this._typeThunk = typeThunk;
    }

    toGraphQLType():GraphQLType {
        return this.inferType();
    }

    private inferType():GraphQLType {
        let type = this._type || resolveThunk(this._typeThunk);

        if (isType(type)) {
            return type;
        }

        if (enumsRegistry.hasEnum(type)) {
            return enumsRegistry.getGraphQLEnumType(type);
        }

        if (_.isFunction(type)) {
            let metadata = getMetadata(type as any);
            invariant(!!metadata, `Missing TypeMetadata for ${type}. Decorate class using @type decorator.`);

            if (metadata instanceof ParamsMetadata) {
                return metadata.toGraphQLInputObjectType();
            }

            if (metadata instanceof TypeMetadata) {
                return metadata.toGraphQLObjectType();
            }

            if (metadata instanceof InterfaceTypeMetadata) {
                return metadata.toGraphQLInterfaceType();
            }

            throw new Error(`Unknown metadata found ${metadata}`)
        }

        throw new Error(`Cannot infer type for ${JSON.stringify(type)}`)
    }
}