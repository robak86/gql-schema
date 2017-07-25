import {ObjectTypeMetadata, TypeConfig} from "../metadata/ObjectTypeMetadata";


export const type = (config:TypeConfig<any, any> = {}):ClassDecorator => {
    return <TFunction extends Function>(klass:TFunction):TFunction => {
        let objectTypeMetadata = ObjectTypeMetadata.getOrCreateForClass(klass);
        objectTypeMetadata.setConfig(config);

        return klass;
    };
};