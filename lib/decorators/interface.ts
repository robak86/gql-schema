import {InterfaceTypeMetadata, TypeConfig} from "../metadata/InterfaceTypeMetadata";

export const interfaceType = (config:TypeConfig<any, any> = {}):ClassDecorator => {
    return <TFunction extends Function>(klass:TFunction):TFunction => {
        let objectTypeMetadata = InterfaceTypeMetadata.getOrCreateForClass(klass);
        objectTypeMetadata.setConfig(config);

        return klass;
    };
};