import {FieldType, TypeProxy} from "../types-conversion/TypeProxy";
import {TypeWrapper} from "../types-conversion/TypeWrapper";
import {
    GraphQLArgumentConfig, GraphQLFieldConfig, GraphQLFieldResolver, GraphQLInputFieldConfig,
    GraphQLInputType, GraphQLOutputType
} from "graphql";
import {ArgsType, ArgumentsTypeProxy} from "../types-conversion/ArgumentsTypeProxy";


//TODO: throw errors from setters for wrong data
export class FieldConfig {
    private type = new TypeProxy();
    private compositeType:TypeWrapper = new TypeWrapper();
    private description:string;
    private args:ArgumentsTypeProxy;
    private resolveFn:GraphQLFieldResolver<any, any>;
    private defaultValue;

    setDefaultValue(val:any) {
        this.defaultValue = val;
    }

    setParamsType(paramsFieldType:ArgsType) {
        this.args = new ArgumentsTypeProxy();
        this.args.setType(paramsFieldType);
    }

    setParamsThunk(paramsFieldTypeThunk:() => ArgsType) {
        this.args = new ArgumentsTypeProxy();
        this.args.setTypeThunk(paramsFieldTypeThunk);
    }

    setResolver(resolveFn:GraphQLFieldResolver<any, any>) {
        this.resolveFn = resolveFn;
    }

    setType(fieldType:FieldType) {
        this.type.setType(fieldType);
    }

    setTypeThunk(fieldTypeThunk:() => FieldType) {
        this.type.setTypeThunk(fieldTypeThunk);
    }

    setNonNullConstraint() {
        this.compositeType.setNonNullConstraint();
    }

    setNonNullItemsConstraint() {
        this.compositeType.setNonNullItemsConstraint();
    }

    setListType(fieldType:FieldType) {
        this.type.setType(fieldType);
        this.compositeType.setArray();
    }

    setListTypeThunk(fieldType:FieldType) {
        this.type.setTypeThunk(fieldType);
        this.compositeType.setArray();
    }

    setDescription(name:string) {
        this.description = name;
    }

    toGraphQLInputFieldConfig():GraphQLArgumentConfig | GraphQLInputFieldConfig {
        let type = this.type.toGraphQLType() as GraphQLInputType;
        type = this.compositeType.wrap(type) as GraphQLInputType;

        return {
            defaultValue: this.defaultValue,
            description: this.description,
            type
        }
    }

    toGraphQLFieldConfig():GraphQLFieldConfig<any, any> {
        let type = this.type.toGraphQLType();
        type = this.compositeType.wrap(type) as GraphQLOutputType;

        return {
            type,
            args: this.args && this.args.toGraphQLType() as any,
            resolve: this.resolveFn,
            description: this.description
        }
    }
}