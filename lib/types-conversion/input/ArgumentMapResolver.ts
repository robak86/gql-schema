import {propagateErrorWithContext} from "../../utils/core";
import {ParamsMetadata} from "../../types-metadata/ParamsMetadata";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";
import {InputFieldConfigMapResolver} from "./InputFieldConfigMapResolver";
import {GraphQLFieldConfigArgumentMap} from "graphql";

export class ArgumentMapResolver extends AbstractTypeResolver<ParamsMetadata, GraphQLFieldConfigArgumentMap> {
    private inputFieldConfigMapBuilder:InputFieldConfigMapResolver = new InputFieldConfigMapResolver(this.typeResolver, this.argsTypeResolver);

    toGraphQLType(metadata:ParamsMetadata):GraphQLFieldConfigArgumentMap {
        return propagateErrorWithContext(metadata.config.get('name'), () => {
            return this.inputFieldConfigMapBuilder.toGraphQLType(metadata.getFieldsMetadata())
        })
    }
}