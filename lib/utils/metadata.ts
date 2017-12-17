import {someOrThrow} from "./core";
import {GRAPHQL_METADATA_KEY, IBaseMetadata} from "../types-metadata/IBaseMetadata";

export function getMetadata(klass:Object):IBaseMetadata<any> {
    return someOrThrow(Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass), `Missing GraphQL metadata for ${klass.constructor.name}`);
}