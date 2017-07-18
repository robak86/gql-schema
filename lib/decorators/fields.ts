import {FieldConfig, FieldsMetadata} from "../metadata/FieldsMetadata";
import {GraphQLType} from "graphql";
import {Type} from "../utils/types";
import {invariant} from "../utils/core";
import * as _ from 'lodash';


function patchField(target, propertyKey, partialConfig:Partial<FieldConfig>) {
    let fieldsMetadata:FieldsMetadata = FieldsMetadata.getOrCreateForClass(target.constructor);
    fieldsMetadata.patchConfig(propertyKey, partialConfig);
}

export const field = (type:Type<any> | GraphQLType):PropertyDecorator => {
    invariant(!!type, `@field decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {type})
};

export const fieldThunk = (thunkType:() => Type<any> | GraphQLType):PropertyDecorator => {
    invariant(_.isFunction(thunkType), `@fieldThunk decorator called with non function param`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {thunkType})
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
    invariant(!!type, `@array decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            notNullItem,
            type})
    }
};

export const arrayThunk = (thunkType:() => Type<any> | GraphQLType, notNullItem:boolean = true):PropertyDecorator => {
    invariant(!!thunkType, `@arrayThunk decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            notNullItem,
            thunkType})
    }
};