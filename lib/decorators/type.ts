import {ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import {GraphQLInterfaceType} from "graphql";
import {Type, Type as Klass} from "../utils/types";

export const type = (params?:{ interfaces:GraphQLInterfaceType | Type<any> }):ClassDecorator => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        ObjectTypeMetadata.getOrCreateForClass(klass);
        return klass;
    };
};