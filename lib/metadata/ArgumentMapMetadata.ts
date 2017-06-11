import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {GraphQLFieldConfigArgumentMap, GraphQLInputType} from "graphql";
import {inferGraphQLType, TypeWrapperParams} from "../utils";
import * as _ from 'lodash';
import {Type} from "../utils/types";

export type ArgumentConfig = {
    type:GraphQLInputType | Type<any>;
    defaultValue?:any;
    description?:string;
} & TypeWrapperParams;


export class ArgumentMapMetadata implements IGraphQLMetadata {
    private arguments:GraphQLFieldConfigArgumentMap = {};

    static getForClass(klass:Type<any>):ArgumentMapMetadata | void {
        return Reflect.getMetadata(GRAPHQL_METADATA_KEY, klass);
    }

    static getOrCreateForClass(klass):ArgumentMapMetadata {
        let nodeMetadata = Reflect.getOwnMetadata(GRAPHQL_METADATA_KEY, klass);

        if (!nodeMetadata) {
            nodeMetadata = new ArgumentMapMetadata();
            Reflect.defineMetadata(GRAPHQL_METADATA_KEY, nodeMetadata, klass);
        }

        return nodeMetadata;
    }

    addArgumentField(propertyName:string, config:ArgumentConfig) {
        this.arguments[propertyName] = {
            ..._.cloneDeep(config),
            type: inferGraphQLType(config.type) as any
        };
    }

    toGraphQLType():GraphQLFieldConfigArgumentMap {
        return this.arguments;
    }
}