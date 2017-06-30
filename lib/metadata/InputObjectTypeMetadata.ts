import 'reflect-metadata';
import * as _ from 'lodash';

import {
    GraphQLList, GraphQLNonNull,
    GraphQLInputObjectType, GraphQLInputType, GraphQLInputFieldConfig
} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {inferGraphQLType} from "../utils";
import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";


export type InputObjectFieldConfig = {
    type:GraphQLInputType | Type<any>;
    defaultValue?:any;
    description?:string;
    array?:boolean;
    nonNullItems?:boolean;
    nonNull?:boolean;
}


export class InputObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InputObjectTypeMetadata);

    private fields:{ [fieldName:string]:GraphQLInputFieldConfig } = {};

    constructor(private klass) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name;
    }

    getField(fieldName:string):GraphQLInputFieldConfig {
        return this.fields[fieldName];
    }

    addField(fieldName:string, config:InputObjectFieldConfig) {
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
        this.addField = () => {
            throw new Error('Cannot add new fields after toGraphQLType call');
        };

        return new GraphQLInputObjectType({
            name: this.className,
            fields: this.fields
        })
    }
}