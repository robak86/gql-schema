import {Type as Klass} from "../utils/types";
import {InputObjectFieldConfig, InputObjectTypeMetadata} from "../metadata/InputObjectTypeMetadata";

export const input = {
    define: () => {
        return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
            InputObjectTypeMetadata.getOrCreateForClass(klass);
            return klass;
        }
    },
    field: (fieldConfig:InputObjectFieldConfig):PropertyDecorator => {
        return (target:Object, propertyKey:string) => {
            let objectTypeMetadata:InputObjectTypeMetadata = InputObjectTypeMetadata.getOrCreateForClass(target.constructor);
            objectTypeMetadata.addField(propertyKey, fieldConfig);
        }
    },

    array: (fieldConfig:InputObjectFieldConfig):PropertyDecorator => {
        return input.field({
            array: true,
            nonNullItems: true,
            nonNull: true,
            ...fieldConfig,
        })
    }
};