import 'reflect-metadata';

import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {isPresent, someOrThrow} from "../utils/core";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _ from 'lodash';
import {FieldsMetadata} from "./FieldsMetadata";
import {GraphQLInterfaceType, GraphQLResolveInfo, GraphQLTypeResolver} from "graphql";
import {inferGraphQLType} from "../decorators/typesInferention";
import {Type} from "../utils/types";


export type TypeResolverForAnnotatedClass<TSource, TContext> = (
    value: TSource,
    context: TContext,
    info: GraphQLResolveInfo
) => Type<any>


export interface TypeConfig<TSource, TContext> {
    name?:string;
    description?:string;
    resolveType?:GraphQLTypeResolver<any, any> | TypeResolverForAnnotatedClass<any, any>;
}

export class InterfaceTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<InterfaceTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InterfaceTypeMetadata);

    private _config:TypeConfig<any, any>;

    constructor(private klass:Function) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
        this._config = {name: klass.name};
    }

    setConfig(config:TypeConfig<any, any>) {
        this._config = {...this._config, ...config};
    }

    toGraphQLType():GraphQLInterfaceType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        let resolveType = isPresent(this._config.resolveType) ?
            (value, context, info) => inferGraphQLType(this._config.resolveType(value, context, info)) :
            null;

        return new GraphQLInterfaceType({
            name: this._config.name,
            description: this._config.description,
            resolveType,
            fields: () => fieldsMetadata.getFields()
        })
    }
}