import {ArgumentConfig, ArgumentMapMetadata} from "../metadata/ArgumentMapMetadata";


export const args = {
    field: (fieldConfig:ArgumentConfig):PropertyDecorator => {
        return (target:Object, propertyKey:string) => {
            let objectTypeMetadata:ArgumentMapMetadata = ArgumentMapMetadata.getOrCreateForClass(target.constructor);
            objectTypeMetadata.addArgumentField(propertyKey, fieldConfig);
        }
    }
};