import {Type} from "../utils/types";
import {GraphQLInputObjectType, GraphQLType, isType} from "graphql";
import {getMetadata} from "../utils/metadata";
import * as _ from 'lodash';
import {enumsRegistry} from "../registry/typesRegistry";

export type ArgsType =
    GraphQLInputObjectType |
    Type<any>

export type FieldType =
    GraphQLType |
    Type<any> |
    Object;

export function inferGraphQLType(klass:FieldType, allowedMetaData:Function[] = []) {
    if (isType(klass)) {
        return klass;
    }

    if (enumsRegistry.hasEnum(klass)) {
        return enumsRegistry.getGraphQLEnumType(klass);
    }

    if (_.isFunction(klass)) {
        let metadata = getMetadata(klass as any);
        if (allowedMetaData.length > 0) {
            let validType = allowedMetaData.some(metadataClass => metadata instanceof metadataClass);
            if (!validType) {
                throw Error(`Annotated ${klass.name} passed as type property is incompatible: Allowed types are ${allowedMetaData}`)
            }
        }

        return metadata.toGraphQLType();
    }

    throw new Error(`Cannot infer type for ${JSON.stringify(klass)}`)
}