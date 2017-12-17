import {BaseTypeMetadata} from "./BaseTypeMetadata";
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {GRAPHQL_METADATA_KEY} from "./IBaseMetadata";

export interface InputConfig {
    name:string;
    description?:string;
}

export class ParamsMetadata extends BaseTypeMetadata<InputConfig> {
    static getForClass = metadataGet<ParamsMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ParamsMetadata);
}