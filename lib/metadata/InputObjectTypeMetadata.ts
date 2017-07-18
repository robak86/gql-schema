import 'reflect-metadata';
import * as _ from 'lodash';

import {GraphQLInputObjectType} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import {someOrThrow} from "../utils/core";
import {FieldsMetadata} from "./FieldsMetadata";



export class InputObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<InputObjectTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InputObjectTypeMetadata);

    private _description:string;

    constructor(private klass) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name;
    }

    setDescription(description:string){
        this._description = description;
    }

    toGraphQLType():GraphQLInputObjectType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        return new GraphQLInputObjectType({
            name: this.className,
            fields: () => fieldsMetadata.getFields() as any,
            description: this._description
        })
    }
}