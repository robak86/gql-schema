import 'reflect-metadata';
import {GraphQLInterfaceType, GraphQLIsTypeOfFn, GraphQLObjectType, Thunk} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {someOrThrow} from "../utils/core";
import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _ from 'lodash';
import {FieldsMetadata} from "./FieldsMetadata";

export interface TypeConfig<TSource, TContext> {
    name?:string;
    interfaces?:Thunk<Array<GraphQLInterfaceType>> | Type<any>; //#TODO: allow for passing annotated classes
    isTypeOf?:GraphQLIsTypeOfFn<TSource, TContext>; //#TODO: autopopulate with instanceof
    description?:string
}

export class ObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<ObjectTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ObjectTypeMetadata);

    private _config:TypeConfig<any, any>;

    constructor(private klass:Function) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name
    }

    setConfig(config:TypeConfig<any, any>) {
        this._config = config;
    }

    toGraphQLType():GraphQLObjectType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        return new GraphQLObjectType({
            name: this.className,
            fields: () => fieldsMetadata.getFields()
        })
    }
}