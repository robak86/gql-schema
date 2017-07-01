import {FieldConfig, FieldsMetadata} from "../metadata/FieldsMetadata";
import {GraphQLType} from "graphql";
import {Type} from "../utils/types";


function patchField(target, propertyKey, partialConfig:Partial<FieldConfig>) {
    let fieldsMetadata:FieldsMetadata = FieldsMetadata.getOrCreateForClass(target.constructor);
    fieldsMetadata.patchConfig(propertyKey, partialConfig);
}

export const field = (type:Type<any> | GraphQLType):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {type})
};

export const notNull = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {notNull: true})
};

export const description = (description:string):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {description})
};

export const params = (argsType:Type<any> | GraphQLType):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {args: argsType})
};

export const resolve = (resolve:Function):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {resolve})
};

export const array = (type:Type<any> | GraphQLType, notNullItem:boolean = true):PropertyDecorator => {
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            notNullItem,
            type})
    }
};