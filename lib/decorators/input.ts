import {Type as Klass} from "../utils/types";
import {InputObjectTypeMetadata} from "../metadata/InputObjectTypeMetadata";


export interface InputConfig {
    description?:string
}

export const input = (config:InputConfig = {}) => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        let inputMetadata = InputObjectTypeMetadata.getOrCreateForClass(klass);

        if (!!config.description) {
            inputMetadata.setDescription(config.description);
        }

        return klass;
    }
};