import {ObjectFieldConfig, ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import {GraphQLInterfaceType} from "graphql";
import {ArgumentConfig, ArgumentMapMetadata} from "../metadata/ArgumentMapMetadata";
import {Type, Type as Klass} from "../utils/types";

export const type = {
    define: (params?:{ interfaces:GraphQLInterfaceType | Type<any> }):ClassDecorator => {
        return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
            ObjectTypeMetadata.getOrCreateForClass(klass);
            return klass;
        };
    },

    field: (fieldConfig:ObjectFieldConfig):PropertyDecorator => {
        return (target:Object, propertyKey:string) => {
            let objectTypeMetadata:ObjectTypeMetadata = ObjectTypeMetadata.getOrCreateForClass(target.constructor);
            objectTypeMetadata.addField(propertyKey, fieldConfig);
        }
    },

    array: (fieldConfig:ObjectFieldConfig):PropertyDecorator => {
        return type.field({
            array: true,
            nonNullItems: true,
            nonNull: true,
            ...fieldConfig,
        })
    }
};