import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "./abstract/IGraphQLMetadata";
import {GraphQLType, isType} from "graphql";
import * as _ from 'lodash';
import {Type} from "./utils/types";
import {someOrThrow} from "./utils/core";

export function getMetadata(klass:Type<any>):IGraphQLMetadata {
    return someOrThrow(Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass), `Missing GraphQL metadata for ${klass.name}`);
}

