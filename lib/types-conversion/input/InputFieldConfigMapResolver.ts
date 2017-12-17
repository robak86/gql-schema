import {propagateErrorWithContext} from "../../utils/core";
import * as _ from "lodash";
import {GraphQLInputFieldConfigMap} from "graphql";
import {FieldsMetadata} from "../../fields-metadata/FieldsMetadata";
import {AbstractTypeResolver} from "../abstract/AbstractTypeResolver";


export class InputFieldConfigMapResolver extends AbstractTypeResolver<FieldsMetadata, GraphQLInputFieldConfigMap> {
    toGraphQLType(fieldsMetadata:FieldsMetadata):GraphQLInputFieldConfigMap {
        return _.mapValues(fieldsMetadata.getFields(), (fieldConfig, fieldName) => {
            return propagateErrorWithContext(`fieldName: ${fieldName}`, () => fieldConfig.toGraphQLInputFieldConfig(this.typeResolver))
        });
    }
}