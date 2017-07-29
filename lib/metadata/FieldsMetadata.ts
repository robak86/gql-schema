import 'reflect-metadata';
import {GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, Thunk} from "graphql";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import * as _ from 'lodash';
import {invariant, isPresent} from "../utils/core";
import {ArgumentMapMetadata} from "./ArgumentMapMetadata";
import {ArgsType, FieldType, inferGraphQLType} from "../decorators/typesInferention";
import {resolveThunk} from "../utils/graphql";


const FIELDS_METADATA_KEY = '__FIELDS_METADATA_KEY';

export interface FieldConfig {
    type:FieldType
    thunkType:Thunk<FieldType>
    nonNull:boolean
    array:boolean
    nonNullItem:boolean
    resolve?:Function
    description?:string
    args?:ArgsType
    thunkArgs:Thunk<FieldType>
    deprecationReason?:string;
}


function convertFieldConfigToGraphQL(config:Partial<FieldConfig>):GraphQLFieldConfig<any, any> {
    let type = inferGraphQLType(config.type || resolveThunk(config.thunkType));
    invariant(!!type, `Cannot infer type`); //TODO: add more reliable way for checking if type is correct

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

    let {resolve, deprecationReason, description} = _.cloneDeep(config);
    return {resolve, deprecationReason, description, type, args} as GraphQLFieldConfig<any, any>;
}

export class FieldsMetadata {
    static getForClass = metadataGet<FieldsMetadata>(FIELDS_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(FIELDS_METADATA_KEY, FieldsMetadata);

    private fields:{ [fieldName:string]:Partial<FieldConfig> } = {};

    constructor(private klass) {}

    getField(fieldName:string):Partial<FieldConfig> {
        return this.fields[fieldName];
    }

    patchConfig(fieldName:string, partialConfig:Partial<FieldConfig>) {
        this.fields[fieldName] = {
            ...this.existingPropsOrDefaults(fieldName),
            ...partialConfig
        }
    }

    getFields():GraphQLFieldConfigMap<any, any> {
        invariant(Object.keys(this.fields).length > 0, `Missing fields definition for ${this.klass.name} class`);
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