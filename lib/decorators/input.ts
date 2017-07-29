import {Type as Klass} from "../utils/types";
import {InputConfig, InputObjectTypeMetadata} from "../metadata/InputObjectTypeMetadata";


export const input = (config:InputConfig = {}) => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        let inputMetadata = InputObjectTypeMetadata.getOrCreateForClass(klass);
        inputMetadata.setConfig(config);

        return klass;
    }
};