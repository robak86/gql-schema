import 'reflect-metadata';
import * as _ from 'lodash';

import {GraphQLInputObjectType, GraphQLInputType} from "graphql";
import {GRAPHQL_METADATA_KEY, IGraphQLMetadata} from "../abstract/IGraphQLMetadata";
import {Type} from "../utils/types";
import {metadataGet, metadataGetOrSet} from "./metadataFactories";
import {someOrThrow} from "../utils/core";
import {FieldsMetadata} from "./FieldsMetadata";


export type InputObjectFieldConfig = {
    type:GraphQLInputType | Type<any>;
    defaultValue?:any;
    description?:string;
    array?:boolean;
    nonNullItems?:boolean;
    nonNull?:boolean;
}


export class InputObjectTypeMetadata implements IGraphQLMetadata {
    static getForClass = metadataGet<InputObjectTypeMetadata>(GRAPHQL_METADATA_KEY);
    static getOrCreateForClass = metadataGetOrSet(GRAPHQL_METADATA_KEY, InputObjectTypeMetadata);

    constructor(private klass) {
        this.toGraphQLType = _.memoize(this.toGraphQLType);
    }

    get className():string {
        return this.klass.name;
    }

    toGraphQLType():GraphQLInputObjectType {
        let fieldsMetadata = someOrThrow(FieldsMetadata.getForClass(this.klass), `Missing fields definition for ${this.klass.name}`);

        return new GraphQLInputObjectType({
            name: this.className,
            fields: fieldsMetadata.getFields() as any
        })
    }
}