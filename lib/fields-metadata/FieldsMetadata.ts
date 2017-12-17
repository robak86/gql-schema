import 'reflect-metadata';
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {FieldConfig} from "./FieldConfig";

const FIELDS_METADATA_KEY = '__FIELDS_METADATA_KEY';

export class FieldsMetadata {
    static getForClass = metadataGet<FieldsMetadata>(FIELDS_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(FIELDS_METADATA_KEY, FieldsMetadata);


    protected _fields:{ [fieldName:string]:FieldConfig } = {};

    getField(fieldName:string):FieldConfig {
        return this._fields[fieldName] || (this._fields[fieldName] = new FieldConfig())
    }

    getFields():{ [fieldName:string]:FieldConfig } {
        return this._fields;
    }
}