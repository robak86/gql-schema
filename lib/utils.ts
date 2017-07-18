import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "./abstract/IGraphQLMetadata";
import {GraphQLType, isType} from "graphql";
import * as _ from 'lodash';
import {Type} from "./utils/types";
import {someOrThrow} from "./utils/core";

export function getMetadata(klass:Type<any>):IGraphQLMetadata {
    return someOrThrow(Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass), `Missing GraphQL metadata for ${klass.name}`);
}

export function inferGraphQLType(klass:Type<any> | GraphQLType, allowedMetaData:Function[] = []) {
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