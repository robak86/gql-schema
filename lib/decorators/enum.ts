import {enumsRegistry} from "../registry/typesRegistry";

/***
 * It makes native typescript enum being acceptable as type for @field decorator
 * @param {string} name
 * @param {Object} enumType
 * @param props
 */
export const decorateEnum = (name:string, enumType:Object, props?) => {
    enumsRegistry.registerEnum(name, enumType)
};