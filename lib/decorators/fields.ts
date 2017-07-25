import {FieldConfig, FieldsMetadata} from "../metadata/FieldsMetadata";

import {Type} from "../utils/types";
import {invariant} from "../utils/core";
import * as _ from 'lodash';
import {
    GraphQLInterfaceType, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType, GraphQLEnumType,
    GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID
} from "graphql";


type GraphType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList<any> |
    GraphQLNonNull<any> | 
    Type<any>;

function patchField(target, propertyKey, partialConfig:Partial<FieldConfig>) {
    let fieldsMetadata:FieldsMetadata = FieldsMetadata.getOrCreateForClass(target.constructor);
    fieldsMetadata.patchConfig(propertyKey, partialConfig);
}

export const id = ():PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {
        type: GraphQLID
    })
};

export const field = (type:GraphType):PropertyDecorator => {
    invariant(!!type, `@field decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {type})
};

export const fieldLazy = (thunkType:() => GraphType):PropertyDecorator => {
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

export const params = (argsType:GraphType):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {args: argsType})
};

export const resolve = (resolve:Function):PropertyDecorator => {
    return (target:Object, propertyKey:string) => patchField(target, propertyKey, {resolve})
};

export const list = (type:GraphType):PropertyDecorator => {
    invariant(!!type, `@array decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            type
        })
    }
};

export const listLazy = (thunkType:() => GraphType):PropertyDecorator => {
    invariant(!!thunkType, `@arrayThunk decorator called with undefined or null value`);
    return (target:Object, propertyKey:string) => {
        patchField(target, propertyKey, {
            array: true,
            thunkType
        })
    }
};