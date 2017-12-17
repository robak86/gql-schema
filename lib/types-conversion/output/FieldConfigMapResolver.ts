import {propagateErrorWithContext} from "../../utils/core";
import * as _ from "lodash";
import {FieldsMetadata} from "../../fields-metadata/FieldsMetadata";
import {GraphQLFieldConfigMap} from "graphql";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";


export class FieldConfigMapResolver extends AbstractTypeResolver<FieldsMetadata, GraphQLFieldConfigMap<any, any>> {
    toGraphQLType(fieldsMetadata:FieldsMetadata):GraphQLFieldConfigMap<any, any> {
        return _.mapValues(fieldsMetadata.getFields(), (fieldConfig, fieldName) => {
            return propagateErrorWithContext(fieldName, () => fieldConfig.toGraphQLFieldConfig(this.typeResolver, this.argsTypeResolver))
        });
    }
}