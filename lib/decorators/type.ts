import {ObjectTypeMetadata, TypeConfig} from "../metadata/ObjectTypeMetadata";
import {Type as Klass} from "../utils/types";

export const type = (config:TypeConfig<any, any> = {}):ClassDecorator => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        let objectTypeMetadata = ObjectTypeMetadata.getOrCreateForClass(klass);
        objectTypeMetadata.setConfig(config);

        return klass;
    };
};