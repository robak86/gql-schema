import 'reflect-metadata';
import {metadataGet} from "../utils/metadataFactories";
import {FieldConfig} from "./FieldConfig";
import {getSuperClass} from "../utils/core";

const FIELDS_METADATA_KEY = '__FIELDS_METADATA_KEY';

export class FieldsMetadata {
    static getForClass = metadataGet<FieldsMetadata>(FIELDS_METADATA_KEY);
    static getOrCreateForClass(klass):FieldsMetadata {
        let attributesMetadata = Reflect.getOwnMetadata(FIELDS_METADATA_KEY, klass);

        if (!attributesMetadata) {
            attributesMetadata = new FieldsMetadata();
            Reflect.defineMetadata(FIELDS_METADATA_KEY, attributesMetadata, klass);


            let superClass = getSuperClass(klass);
            if (superClass) {
                attributesMetadata.setParent(FieldsMetadata.getOrCreateForClass(superClass));
            }
        }

        return attributesMetadata;
    }


    private parent:FieldsMetadata;
    protected _ownFields:{ [fieldName:string]:FieldConfig } = {};

    getField(fieldName:string):FieldConfig {
        return this._ownFields[fieldName] || (this._ownFields[fieldName] = new FieldConfig())
    }

    getFields():{ [fieldName:string]:FieldConfig } {
        let parentFields = this.parent ? this.parent.getFields() : {};

        //TODO: consider deep merge of field configuration. In current implementation ownField configuration overrides completely field config from parent
        return {
            ...parentFields,
            ...this._ownFields
        }
    }

    private setParent(fieldsMetadata:FieldsMetadata) {
        this.parent = fieldsMetadata;
    }
}



