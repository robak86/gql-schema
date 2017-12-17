import {TypeMetadata} from "../../types-metadata/TypeMetadata";
import {GraphQLInterfaceType, GraphQLObjectType} from "graphql";
import {isPresent, propagateErrorWithContext} from "../../utils/core";
import {resolveThunk} from "../../utils/graphql";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";
import {FieldConfigMapResolver} from "./FieldConfigMapResolver";

export class ObjectTypeResolver extends AbstractTypeResolver<TypeMetadata, GraphQLObjectType> {
    private fieldConfigMapBuilder:FieldConfigMapResolver = new FieldConfigMapResolver(this.typeResolver, this.argsTypeResolver);

    toGraphQLType(metadata:TypeMetadata):GraphQLObjectType {
        return propagateErrorWithContext(metadata.config.get('name'), () => {
            let fieldsThunk = () => this.fieldConfigMapBuilder.toGraphQLType(metadata.getFieldsMetadata());

            let interfaces = isPresent(metadata.config.get('interfaces')) ?
                resolveThunk(metadata.config.get('interfaces')).map(type => this.typeResolver.toGraphQLType(type) as GraphQLInterfaceType) :
                null;

            return new GraphQLObjectType({
                name: metadata.config.get('name'),
                description: metadata.config.get('description'),
                interfaces,
                fields: fieldsThunk
            })
        })
    }
}