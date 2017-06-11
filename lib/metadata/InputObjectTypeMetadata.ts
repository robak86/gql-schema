import 'reflect-metadata';
import * as _ from 'lodash';

import {
    GraphQLList, GraphQLNonNull,
    GraphQLInputObjectType, GraphQLInputType, GraphQLInputFieldConfig
} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {inferGraphQLType} from "../utils";
import {Type} from "../utils/types";
import {invariant, isPresent} from "../utils/core";


export type InputObjectFieldConfig = {
    type:GraphQLInputType | Type<any>;
    defaultValue?:any;
    description?:string;
    array?:boolean;
    nonNullItems?:boolean;
    nonNull?:boolean;
}


export class InputObjectTypeMetadata implements IGraphQLMetadata {
    private fields:{ [fieldName:string]:GraphQLInputFieldConfig } = {};
    private _memoizedGraphQLType;

    private constructor(private className) {}

    static getForClass(klass:Type<any>):InputObjectTypeMetadata | void {
        return Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass);
    }

    static getOrCreateForClass(klass):InputObjectTypeMetadata {
        let nodeMetadata = Reflect.getOwnMetadata(GRAPHQL_METADATA_KEY, klass);

        if (!nodeMetadata) {
            nodeMetadata = new InputObjectTypeMetadata(klass.name);
            Reflect.defineMetadata(GRAPHQL_METADATA_KEY, nodeMetadata, klass);
        }

        return nodeMetadata;
    }

    getField(fieldName:string):GraphQLInputFieldConfig {
        return this.fields[fieldName];
    }

    addField(fieldName:string, config:InputObjectFieldConfig) {
        invariant(!isPresent(this._memoizedGraphQLType), 'Cannot add new fields after toGraphQLType call');
        let type = inferGraphQLType(config.type);

        if (config.nonNullItems && config.array) {
            type = new GraphQLList(new GraphQLNonNull(type))
        }

        if (!config.nonNullItems && config.array) {
            type = new GraphQLList(type)
        }

        if (config.nonNull) {
            type = new GraphQLNonNull(type);
        }

        let converted = {..._.cloneDeep(config), type};
        this.fields[fieldName] = converted as any;
    }

    toGraphQLType():GraphQLInputObjectType {
        return this._memoizedGraphQLType || (this._memoizedGraphQLType = new GraphQLInputObjectType({
                name: this.className,
                fields: this.fields
            } as any))
    }
}