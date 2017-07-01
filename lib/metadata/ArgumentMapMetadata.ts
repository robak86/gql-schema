import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {GraphQLFieldConfigArgumentMap, GraphQLInputType} from "graphql";
import {TypeWrapperParams} from "../utils";
import {Type} from "../utils/types";
import {FieldsMetadata} from "./FieldsMetadata";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import {someOrThrow} from "../utils/core";

export type ArgumentConfig = {
    type:GraphQLInputType | Type<any>;
    defaultValue?:any;
    description?:string;
} & TypeWrapperParams;


export class ArgumentMapMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<ArgumentMapMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ArgumentMapMetadata);

    constructor(private klass) {}

    toGraphQLType():GraphQLFieldConfigArgumentMap {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);
        return fieldsMetadata.getFields() as GraphQLFieldConfigArgumentMap;
    }
}