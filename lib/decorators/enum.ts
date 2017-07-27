import {enumsRegistry} from "../registry/typesRegistry";

export const decorateEnum = (name:string, enumType:Object, props?) => {
    enumsRegistry.registerEnum(name, enumType)
};