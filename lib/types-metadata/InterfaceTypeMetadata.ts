import 'reflect-metadata';
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {GraphQLResolveInfo, GraphQLTypeResolver} from "graphql";
import {ClassType} from "../utils/types";
import {BaseTypeMetadata} from "./BaseTypeMetadata";
import {GRAPHQL_METADATA_KEY} from "./IBaseMetadata";

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
}