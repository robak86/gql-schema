import {Type as Klass} from "../utils/types";
import {InputObjectTypeMetadata} from "../metadata/InputObjectTypeMetadata";


export const input = () => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        InputObjectTypeMetadata.getOrCreateForClass(klass);
        return klass;
    }
};