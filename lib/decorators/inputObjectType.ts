import {Type as Klass} from "../utils/types";
import {InputObjectFieldConfig, InputObjectTypeMetadata} from "../metadata/InputObjectTypeMetadata";


export const InputObjectType:() => ClassDecorator = function () {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        InputObjectTypeMetadata.getOrCreateForClass(klass);
        return klass;
    };
};

export function input(fieldConfig:InputObjectFieldConfig):PropertyDecorator {
    return (target:Object, propertyKey:string) => {
        let objectTypeMetadata:InputObjectTypeMetadata = InputObjectTypeMetadata.getOrCreateForClass(target.constructor);
        objectTypeMetadata.addField(propertyKey, fieldConfig);
    }
}

export function arrayInput(fieldConfig:InputObjectFieldConfig):PropertyDecorator {
    return input({
        array: true,
        nonNullItems: true,
        nonNull: true,
        ...fieldConfig,
    })
}