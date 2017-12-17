import {propagateErrorWithContext} from "../../utils/core";
import {GraphQLInputObjectType} from "graphql";
import {ParamsMetadata} from "../../types-metadata/ParamsMetadata";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";
import {InputFieldConfigMapResolver} from "./InputFieldConfigMapResolver";

export class InputObjectTypeResolver extends AbstractTypeResolver<ParamsMetadata,GraphQLInputObjectType> {
    private inputFieldConfigMapBuilder:InputFieldConfigMapResolver =  new InputFieldConfigMapResolver(this.typeResolver, this.argsTypeResolver);

    toGraphQLType(metadata:ParamsMetadata):GraphQLInputObjectType {
        return propagateErrorWithContext(metadata.config.get('name'), () => {
            let fieldsThunk = () => this.inputFieldConfigMapBuilder.toGraphQLType(metadata.getFieldsMetadata());
            return new GraphQLInputObjectType({
                name: metadata.config.get('name'),
                description: metadata.config.get('description'),
                fields: fieldsThunk
            })
        })
    }
}