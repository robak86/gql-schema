import {FieldsMetadata} from "../fields-metadata/FieldsMetadata";
import {FieldConfig} from "../fields-metadata/FieldConfig";

export function createFieldDecorator(updateFieldsMetadata:(fieldConfig:FieldConfig) => void):PropertyDecorator {
    return (target:Object, propertyKey:string) => {
        try {
            let meta = FieldsMetadata.getOrCreateForClass(target.constructor);
            updateFieldsMetadata(meta.getField(propertyKey));
        } catch (e) {
            throw new Error(`Class: ${target.constructor.name}, property: ${propertyKey}. Error message: ${e.message}`)
        }
    }
}