import {TypeConfigParams, TypeMetadata} from "../types-metadata/TypeMetadata";

export const type = (config:Partial<TypeConfigParams> = {}):ClassDecorator => {
    return <TFunction extends Function>(klass:TFunction):TFunction => {
        let objectTypeMetadata = TypeMetadata.getOrCreateForClass(klass);
        objectTypeMetadata.setConfig(config);
        return klass;
    };
};