import {FieldConfig, FieldsMetadata} from "../metadata/FieldsMetadata";
import {invariant} from "../utils/core";
import * as _ from 'lodash';
import {GraphQLID} from "graphql";
import {ArgsType, FieldType} from "./typesInferention";


function patchField(target, propertyKey, partialConfig:Partial<FieldConfig>) {
    let fieldsMetadata:FieldsMetadata = FieldsMetadata.getOrCreateForClass(target.constructor);
    fieldsMetadata.patchConfig(propertyKey, partialConfig);
}

export const id = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {
        type: GraphQLID
    })
};

export const field = (type:FieldType|Object):PropertyDecorator => {
    invariant(!!type, `@field decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {type})
};

export const fieldLazy = (thunkType:() => (FieldType|Object)):PropertyDecorator => {
    invariant(_.isFunction(thunkType), `@fieldThunk decorator called with non function param`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {thunkType})
};

export const nonNull = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {nonNull: true})
};

export const nonNullItems = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {nonNullItem: true})
};

export const description = (description:string):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {description})
};

export const params = (argsType:ArgsType):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {args: argsType})
};

export const resolve = (resolve:Function):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {resolve})
};

export const list = (type:FieldType):PropertyDecorator => {
    invariant(!!type, `@array decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            type
        })
    }
};

export const listLazy = (thunkType:() => FieldType):PropertyDecorator => {
    invariant(!!thunkType, `@arrayThunk decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            thunkType
        })
    }
};