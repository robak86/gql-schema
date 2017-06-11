import 'reflect-metadata';
import * as _ from 'lodash';
import {
    GraphQLField, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLList, GraphQLNonNull, GraphQLObjectType,
    GraphQLOutputType
} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {inferGraphQLType, TypeWrapperParams} from "../utils";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";
import {invariant, isPresent} from "../utils/core";
import {Type} from "../utils/types";


export type ObjectFieldType = GraphQLOutputType | Type<any>;

export type ObjectFieldConfig = {
    type:ObjectFieldType;
    args?:GraphQLFieldConfigArgumentMap | Type<any>;
    resolve?:GraphQLFieldResolver<any, any>;
    deprecationReason?:string;
    description?:string;
} & TypeWrapperParams;


export class ObjectTypeMetadata implements IGraphQLMetadata {
    private fields:{ [fieldName:string]:GraphQLField<any, any> & { type:any } } = {};
    private _memoizedGraphQLType;

    private constructor(private className) {}

    static getForClass(klass:Type<any>):ObjectTypeMetadata | void {
        return Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass);
    }

    static getOrCreateForClass(klass):ObjectTypeMetadata {
        let nodeMetadata = Reflect.getOwnMetadata(GRAPHQL_METADATA_KEY, klass);

        if (!nodeMetadata) {
            nodeMetadata = new ObjectTypeMetadata(klass.name);
            Reflect.defineMetadata(GRAPHQL_METADATA_KEY, nodeMetadata, klass);
        }

        return nodeMetadata;
    }

    getField(fieldName:string):GraphQLField<any, any> {
        return this.fields[fieldName];
    }

    addField(fieldName:string, config:ObjectFieldConfig) {
        invariant(!isPresent(this._memoizedGraphQLType), 'Cannot add new fields after toGraphQLType call');
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
        return this._memoizedGraphQLType || (this._memoizedGraphQLType = new GraphQLObjectType({
                name: this.className,
                fields: this.fields
            } as any))
    }
}