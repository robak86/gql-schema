import {ObjectFieldConfig, ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import {GraphQLArgument, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver, GraphQLOutputType} from "graphql";



export function objectField(fieldConfig:ObjectFieldConfig):PropertyDecorator {
    return (target:Object, propertyKey:string) => {
        let objectTypeMetadata:ObjectTypeMetadata = ObjectTypeMetadata.getOrCreateForClass(target.constructor);
        objectTypeMetadata.addField(propertyKey, fieldConfig);
    }
}

export function arrayField(fieldConfig:ObjectFieldConfig):PropertyDecorator {
    return objectField({
        array: true,
        nonNullItems: true,
        nonNull: true,
        ...fieldConfig,
    })
}