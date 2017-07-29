import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {Type} from "./types";
import {someOrThrow} from "./core";

export function getMetadata(klass:Type<any>):IGraphQLMetadata {
    return someOrThrow(Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass), `Missing GraphQL metadata for ${klass.name}`);
}