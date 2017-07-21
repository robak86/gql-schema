import 'reflect-metadata';
import {GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLType, Thunk} from "graphql";

import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _ from 'lodash';
import {inferGraphQLType} from "../utils";
import {invariant, isPresent} from "../utils/core";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";


const FIELDS_METADATA_KEY = '__FIELDS_METADATA_KEY';

export interface FieldConfig {
    type:Type<any> | GraphQLType
    thunkType:Thunk<Type<any> | GraphQLType>
    nonNull:boolean
    array:boolean
    nonNullItem:boolean
    resolve?:Function
    description?:string;
    args?:Type<any> | GraphQLType
    thunkArgs:Thunk<Type<any> | GraphQLType>
}

function resolveThunk<T>(thunk:Thunk<T>):T {
    return typeof thunk === 'function' ? thunk() : thunk;
}

function convertFieldConfigToGraphQL(config:Partial<FieldConfig>):GraphQLFieldConfig<any, any> {
    let type = inferGraphQLType(config.type || resolveThunk(config.thunkType));
    invariant(type, `Cannot infer type`);

    let args = isPresent(config.args || resolveThunk(config.thunkArgs)) ? inferGraphQLType(config.args as any, [ArgumentMapMetadata]) : null;

    if (config.nonNullItem && config.array) {
        type = new GraphQLList(new GraphQLNonNull(type))
    }

    if (!config.nonNullItem && config.array) {
        type = new GraphQLList(type)
    }

    if (config.nonNull) {
        type = new GraphQLNonNull(type);
    }

    return {..._.cloneDeep(config), type, args} as GraphQLFieldConfig<any, any>;
}

export class FieldsMetadata {
    static getForClass = metadataGet<FieldsMetadata>(FIELDS_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(FIELDS_METADATA_KEY, FieldsMetadata);

    private fields:{ [fieldName:string]:Partial<FieldConfig> } = {};

    constructor() {}

    getField(fieldName:string):Partial<FieldConfig> {
        return this.fields[fieldName];
    }

    patchConfig(fieldName:string, partialConfig:Partial<FieldConfig>) {
        this.fields[fieldName] = {
            ...this.existingPropsOrDefaults(fieldName),
            ...partialConfig
        }
    }

    getFields() {
        return _.mapValues(this.fields, convertFieldConfigToGraphQL);
    }


    private existingPropsOrDefaults(fieldName:string) {
        return this.fields[fieldName] || {
            nonNull: false,
            array: false,
            nonNullItem: false
        };
    }
}