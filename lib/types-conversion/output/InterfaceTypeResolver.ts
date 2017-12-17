import {InterfaceTypeMetadata} from "../../types-metadata/InterfaceTypeMetadata";
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLTypeResolver} from "graphql";
import {isPresent} from "../../utils/core";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";
import {FieldConfigMapResolver} from "./FieldConfigMapResolver";

export class InterfaceTypeResolver extends AbstractTypeResolver<InterfaceTypeMetadata, GraphQLInterfaceType> {
    private fieldConfigMapBuilder:FieldConfigMapResolver = new FieldConfigMapResolver(this.typeResolver, this.argsTypeResolver);

    toGraphQLType(metadata:InterfaceTypeMetadata):GraphQLInterfaceType {
        let resolveType:GraphQLTypeResolver<any, any> = isPresent(metadata.config.get('resolveType')) ?
            (value, context, info) => this.typeResolver.toGraphQLType(metadata.config.get('resolveType')(value, context, info)) as GraphQLObjectType :
            null;

        let fieldsThunk = () => this.fieldConfigMapBuilder.toGraphQLType(metadata.getFieldsMetadata());

        return new GraphQLInterfaceType({
            name: metadata.config.get('name'),
            description: metadata.config.get('description'),
            resolveType,
            fields: fieldsThunk
        })
    }
}