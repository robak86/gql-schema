import {BaseTypeMetadata, GRAPHQL_METADATA_KEY} from "./BaseTypeMetadata";
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {GraphQLInterfaceType, GraphQLIsTypeOfFn, GraphQLObjectType, Thunk} from "graphql";
import {isPresent, propagateErrorWithContext} from "../utils/core";
import {resolveThunk} from "../utils/graphql";
import {TypeProxy} from "../types-conversion/TypeProxy";
import {ClassType} from "../utils/types";

export interface TypeConfigParams {
    name:string;
    interfaces?:Thunk<Array<GraphQLInterfaceType | ClassType<any>>>;
    isTypeOf?:GraphQLIsTypeOfFn<any, any>; //#TODO: autopopulate with instanceof
    description?:string
}

export class TypeMetadata extends BaseTypeMetadata<TypeConfigParams> {
    static getForClass = metadataGet<TypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, TypeMetadata);

    private _memoizedGraphQLObjectType:GraphQLObjectType;

    toGraphQLObjectType():GraphQLObjectType {
        return this._memoizedGraphQLObjectType || (this._memoizedGraphQLObjectType = this.buildGraphQLObjectType());
    }

    private buildGraphQLObjectType():GraphQLObjectType {
        return propagateErrorWithContext(this.klass.name, () => {
            let fieldsThunk = () => this.getFieldsMetadata().toGraphQLFieldConfigMap();

            let interfaces = isPresent(this.config.get('interfaces')) ?
                resolveThunk(this.config.get('interfaces')).map(type => TypeProxy.inferType(type) as GraphQLInterfaceType) :
                null;

            return new GraphQLObjectType({
                name: this.config.get('name'),
                description: this.config.get('description'),
                interfaces,
                fields: fieldsThunk
            })
        })
    }
}