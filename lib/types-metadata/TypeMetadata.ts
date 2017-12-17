import {BaseTypeMetadata} from "./BaseTypeMetadata";
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {GraphQLInterfaceType, GraphQLIsTypeOfFn, Thunk} from "graphql";
import {ClassType} from "../utils/types";
import {GRAPHQL_METADATA_KEY} from "./IBaseMetadata";

export interface TypeConfigParams {
    name:string;
    interfaces?:Thunk<Array<GraphQLInterfaceType | ClassType<any>>>;
    isTypeOf?:GraphQLIsTypeOfFn<any, any>; //#TODO: autopopulate with instanceof
    description?:string
}

export class TypeMetadata extends BaseTypeMetadata<TypeConfigParams> {
    static getForClass = metadataGet<TypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, TypeMetadata);
}