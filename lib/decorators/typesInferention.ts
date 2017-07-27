import {Type} from "../utils/types";
import {
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType,
    isType
} from "graphql";
import {getMetadata} from "../utils";
import * as _ from 'lodash';
import {enumsRegistry} from "../registry/typesRegistry";


export type ArgsType =
    GraphQLInputObjectType |
    Type<any>

export type FieldType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList<any> |
    GraphQLNonNull<any> |
    Type<any> |
    Object;


export function inferGraphQLType(klass:FieldType, allowedMetaData:Function[] = []) {
    if (enumsRegistry.hasEnum(klass)){
        return enumsRegistry.getGraphQLEnumType(klass);
    }

    if (isType(klass) || !_.isFunction(klass)) {
        return klass;
    } else {
        let metadata = getMetadata(klass as any);
        if (allowedMetaData.length > 0) {
            let validType = allowedMetaData.some(metadataClass => metadata instanceof metadataClass);
            if (!validType) {
                throw Error(`Annotated ${klass.name} passed as type property is incompatible: Allowed types are ${allowedMetaData}`)
            }
        }

        return metadata.toGraphQLType();
    }
}