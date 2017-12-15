import {someOrThrow} from "./core";
import {BaseTypeMetadata, GRAPHQL_METADATA_KEY} from "../types-metadata/BaseTypeMetadata";

export function getMetadata(klass:Object):BaseTypeMetadata<any> {
    return someOrThrow(Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass), `Missing GraphQL metadata for ${klass.constructor.name}`);
}