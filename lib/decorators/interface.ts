import {InterfaceTypeMetadata, InterfaceTypeConfig} from "../types-metadata/InterfaceTypeMetadata";

export const interfaceType = (config:Partial<InterfaceTypeConfig> = {}):ClassDecorator => {
    return <TFunction extends Function>(klass:TFunction):TFunction => {
        let objectTypeMetadata = InterfaceTypeMetadata.getOrCreateForClass(klass);
        objectTypeMetadata.setConfig(config);
        return klass;
    };
};