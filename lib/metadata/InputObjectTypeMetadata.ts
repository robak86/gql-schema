import 'reflect-metadata';
import * as _ from 'lodash';

import {GraphQLInputObjectType} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import {someOrThrow} from "../utils/core";
import {FieldsMetadata} from "./FieldsMetadata";

export interface InputConfig {
    name?: string;
    description?: string;
}

export class InputObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<InputObjectTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InputObjectTypeMetadata);


    private _config:InputConfig;

    constructor(private klass) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
        this._config = {name: klass.name};
    }

    setConfig(config:InputConfig) {
        this._config = {...this._config, ...config};
    }

    toGraphQLType():GraphQLInputObjectType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        return new GraphQLInputObjectType({
            name: this._config.name,
            fields: () => fieldsMetadata.getFields() as any,
            description: this._config.description
        })
    }
}