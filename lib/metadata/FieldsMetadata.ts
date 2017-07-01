import 'reflect-metadata';
import {GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLType} from "graphql";

import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _  from 'lodash';
import {inferGraphQLType} from "../utils";
import {isPresent} from "../utils/core";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";


const FIELDS_METADATA_KEY = '__FIELDS_METADATA_KEY';

export interface FieldConfig {
    type:Type<any> | GraphQLType
    notNull:boolean
    array:boolean
    notNullItem:boolean
    resolve?:Function
    description?:string;
    args?:Type<any> | GraphQLType
}


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

export class FieldsMetadata {
    static getForClass = metadataGet<FieldsMetadata>(FIELDS_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(FIELDS_METADATA_KEY, FieldsMetadata);

    private fields:{ [fieldName:string]:Partial<FieldConfig> } = {};

    constructor() {
        // this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    getField(fieldName:string):Partial<FieldConfig> {
        return this.fields[fieldName];
    }

    patchConfig(fieldName:string, partialConfig:Partial<FieldConfig>) {
        this.fields[fieldName] = {
            ...this.existingPropsOrDefaults(fieldName),
            ...partialConfig
        }
    }

    forEachField(iter: (fieldConfig:Partial<FieldConfig>, fieldName:string) => void){
        _.forOwn(this.fields,iter)
    }


    getFields() {
        return _.mapValues(this.fields, convertFieldConfigToGraphQL);
    }

    // addField(fieldName:string, config:FieldConfig) {
    //     let type = inferGraphQLType(config.type);
    //     let args = isPresent(config.args) ? inferGraphQLType(config.args as any, [ArgumentMapMetadata]) : null;
    //
    //     if (config.nonNullItems && config.array) {
    //         type = new GraphQLList(new GraphQLNonNull(type))
    //     }
    //
    //     if (!config.nonNullItems && config.array) {
    //         type = new GraphQLList(type)
    //     }
    //
    //     if (config.nonNull) {
    //         type = new GraphQLNonNull(type);
    //     }
    //
    //     let converted = {..._.cloneDeep(config), type, args};
    //
    //     this.fields[fieldName] = converted as any;
    // }
    //
    // toGraphQLType():GraphQLObjectType {
    //     invariant(() => Object.keys(this.fields).length > 0, `type ${this.className} doesn't contain any fields definition`);
    //
    //     this.addField = () => {
    //         throw new Error('Cannot add new fields after toGraphQLType call')
    //     };
    //
    //     return new GraphQLObjectType({
    //         name: this.className,
    //         fields: this.fields
    //     })
    // }
    //
    private existingPropsOrDefaults(fieldName:string) {
        return this.fields[fieldName] || {
                notNull: false,
                array: false,
                notNullItem: false
            };
    }
}