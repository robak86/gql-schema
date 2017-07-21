import {FieldConfig, FieldsMetadata} from "../metadata/FieldsMetadata";
import {GraphQLID, GraphQLType} from "graphql";
import {Type} from "../utils/types";
import {invariant} from "../utils/core";
import * as _ from 'lodash';


function patchField(target, propertyKey, partialConfig:Partial<FieldConfig>) {
    let fieldsMetadata:FieldsMetadata = FieldsMetadata.getOrCreateForClass(target.constructor);
    fieldsMetadata.patchConfig(propertyKey, partialConfig);
}

export const id = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {
        type: GraphQLID,
        nonNull: true
    })
};

export const field = (type:Type<any> | GraphQLType):PropertyDecorator => {
    invariant(!!type, `@field decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {type})
};

export const fieldLazy = (thunkType:() => Type<any> | GraphQLType):PropertyDecorator => {
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

export const params = (argsType:Type<any> | GraphQLType):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {args: argsType})
};

export const resolve = (resolve:Function):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {resolve})
};

export const list = (type:Type<any> | GraphQLType):PropertyDecorator => {
    invariant(!!type, `@array decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            type
        })
    }
};

export const listLazy = (thunkType:() => Type<any> | GraphQLType):PropertyDecorator => {
    invariant(!!thunkType, `@arrayThunk decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            thunkType
        })
    }
};