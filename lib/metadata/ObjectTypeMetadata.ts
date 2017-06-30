import 'reflect-metadata';
import {
    GraphQLField, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLList, GraphQLNonNull, GraphQLObjectType,
    GraphQLOutputType
} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {inferGraphQLType, TypeWrapperParams} from "../utils";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";
import {invariant, isPresent} from "../utils/core";
import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _  from 'lodash';

export type ObjectFieldType = GraphQLOutputType | Type<any>;

export type ObjectFieldConfig = {
    type:ObjectFieldType;
    args?:GraphQLFieldConfigArgumentMap | Type<any>;
    resolve?:GraphQLFieldResolver<any, any>;
    deprecationReason?:string;
    description?:string;
} & TypeWrapperParams;


export class ObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ObjectTypeMetadata);

    private fields:{ [fieldName:string]:GraphQLField<any, any> & { type:any } } = {};

    constructor(private klass:Function) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name
    }

    getField(fieldName:string):GraphQLField<any, any> {
        return this.fields[fieldName];
    }

    addField(fieldName:string, config:ObjectFieldConfig) {
        let type = inferGraphQLType(config.type);
        let args = isPresent(config.args) ? inferGraphQLType(config.args as any, [ArgumentMapMetadata]) : null;

        if (config.nonNullItems && config.array) {
            type = new GraphQLList(new GraphQLNonNull(type))
        }

        if (!config.nonNullItems && config.array) {
            type = new GraphQLList(type)
        }

        if (config.nonNull) {
            type = new GraphQLNonNull(type);
        }

        let converted = {..._.cloneDeep(config), type, args};

        this.fields[fieldName] = converted as any;
    }

    toGraphQLType():GraphQLObjectType {
        invariant(() => Object.keys(this.fields).length  > 0, `type ${this.className} doesn't contain any fields definition`);

        this.addField = () => {
            throw new Error('Cannot add new fields after toGraphQLType call')
        };

        return new GraphQLObjectType({
            name: this.className,
            fields: this.fields
        })
    }
}