import {ClassType as Klass} from "../utils/types";
import {InputConfig, ParamsMetadata} from "../types-metadata/ParamsMetadata";

export const input = (config:Partial<InputConfig> = {}) => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        let paramsMetadata = ParamsMetadata.getOrCreateForClass(klass);
        paramsMetadata.setConfig(config);
        return klass;
    }
};