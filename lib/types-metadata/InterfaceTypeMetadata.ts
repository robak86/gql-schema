import 'reflect-metadata';
import {isPresent} from "../utils/core";
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLResolveInfo, GraphQLTypeResolver} from "graphql";
import {ClassType} from "../utils/types";
import {TypeProxy} from "../types-conversion/TypeProxy";
import {BaseTypeMetadata, GRAPHQL_METADATA_KEY} from "./BaseTypeMetadata";

export type TypeResolverForAnnotatedClass<TSource, TContext> = (value:TSource,
                                                                context:TContext,
                                                                info:GraphQLResolveInfo) => ClassType<any>

export interface InterfaceTypeConfig {
    name:string;
    description?:string;
    resolveType?:GraphQLTypeResolver<any, any> | TypeResolverForAnnotatedClass<any, any>;
}

export class InterfaceTypeMetadata extends BaseTypeMetadata<InterfaceTypeConfig> {
    static getForClass = metadataGet<InterfaceTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InterfaceTypeMetadata);

    private _memoizedInterfaceType:GraphQLInterfaceType;

    toGraphQLInterfaceType():GraphQLInterfaceType {
        return this._memoizedInterfaceType || (this._memoizedInterfaceType = this.buildGraphQLInterfaceType());
    }

    private buildGraphQLInterfaceType():GraphQLInterfaceType {

        //TODO: create some type proxy class
        let resolveType:GraphQLTypeResolver<any, any> = isPresent(this.config.get('resolveType')) ?
            (value, context, info) => TypeProxy.inferType(this.config.get('resolveType')(value, context, info)) as GraphQLObjectType :
            null;

        let fieldsThunk = () => this.getFieldsMetadata().toGraphQLFieldConfigMap();

        return new GraphQLInterfaceType({
            name: this.config.get('name'),
            description: this.config.get('description'),
            resolveType,
            fields: fieldsThunk
        })
    }
}