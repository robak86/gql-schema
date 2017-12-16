import {BaseTypeMetadata, GRAPHQL_METADATA_KEY} from "./BaseTypeMetadata";
import {GraphQLFieldConfigArgumentMap, GraphQLInputObjectType} from "graphql";
import {metadataGet, metadataGetOrSet} from "../utils/metadataFactories";
import {propagateErrorWithContext} from "../utils/core";

export interface InputConfig {
    name:string;
    description?:string;
}

export class ParamsMetadata extends BaseTypeMetadata<InputConfig> {
    static getForClass = metadataGet<ParamsMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, ParamsMetadata);

    private _memoizedInputType:GraphQLInputObjectType;
    private _memoizedArgumentsType:GraphQLFieldConfigArgumentMap;

    toGraphQLInputObjectType():GraphQLInputObjectType {
        return this._memoizedInputType || (this._memoizedInputType = this.buildGraphQLInputObjectType());
    }

    toGraphQLFieldConfigArgumentMap():GraphQLFieldConfigArgumentMap {
        return this._memoizedArgumentsType || (this._memoizedArgumentsType = this.buildGraphQLFieldConfigArgumentMap());
    }

    private buildGraphQLInputObjectType():GraphQLInputObjectType {
        return propagateErrorWithContext(this.klass.name, () => {
            let fieldsThunk = this.getFieldsMetadata().toGraphQLInputFieldConfigMap();

            return new GraphQLInputObjectType({
                name: this.config.get('name'),
                description: this.config.get('description'),
                fields: fieldsThunk
            })
        })
    }

    private buildGraphQLFieldConfigArgumentMap():GraphQLFieldConfigArgumentMap {
        return propagateErrorWithContext(this.klass.name, () => {
            return this.getFieldsMetadata().toGraphQLInputFieldConfigMap()
        })
    }
}