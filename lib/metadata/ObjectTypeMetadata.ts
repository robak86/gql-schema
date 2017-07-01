import 'reflect-metadata';
import {
    GraphQLField, GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLList, GraphQLNonNull,
    GraphQLObjectType,
    GraphQLOutputType
} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {inferGraphQLType, TypeWrapperParams} from "../utils";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";
import {invariant, isPresent, someOrThrow} from "../utils/core";
import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _  from 'lodash';
import {FieldConfig, FieldsMetadata} from "./FieldsMetadata";

// export type ObjectFieldType = GraphQLOutputType | Type<any>;

// export type ObjectFieldConfig = {
//     type:ObjectFieldType;
//     args?:GraphQLFieldConfigArgumentMap | Type<any>;
//     resolve?:GraphQLFieldResolver<any, any>;
//     deprecationReason?:string;
//     description?:string;
// } & TypeWrapperParams;



function convertFieldConfigToGraphQL(config:Partial<FieldConfig>):GraphQLFieldConfig<any, any>  {
    let type = inferGraphQLType(config.type);
    let args = isPresent(config.args) ? inferGraphQLType(config.args as any, [ArgumentMapMetadata]) : null;

    if (config.notNullItem && config.array) {
        type = new GraphQLList(new GraphQLNonNull(type))
    }

    if (!config.notNullItem && config.array) {
        type = new GraphQLList(type)
    }

    if (config.notNull) {
        type = new GraphQLNonNull(type);
    }

    return {..._.cloneDeep(config), type, args} as GraphQLFieldConfig<any, any>;
}


export class ObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<ObjectTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ObjectTypeMetadata);

    // private fields:{ [fieldName:string]:GraphQLField<any, any> & { type:any } } = {};

    constructor(private klass:Function) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name
    }

    toGraphQLType():GraphQLObjectType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        return new GraphQLObjectType({
            name: this.className,
            fields: fieldsMetadata.getFields()
        })
    }
}