import {TypeValue} from "./TypeValue";
import {TypeWrapper} from "./TypeWrapper";
import {
    GraphQLArgumentConfig, GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldResolver,
    GraphQLInputFieldConfig,
    GraphQLInputType, GraphQLOutputType, GraphQLType
} from "graphql";
import {ITypeResolver} from "../types-conversion/abstract/ITypeResolver";
import {ClassType} from "../utils/types";

export type FieldType =
    GraphQLType |
    ClassType<any> |
    Object;

export type ArgsType =
    GraphQLFieldConfigArgumentMap |
    ClassType<any>

//TODO: throw errors from setters for wrong data
export class FieldConfig {
    private type = new TypeValue<FieldType>();
    private args:TypeValue<ArgsType>;
    private compositeType:TypeWrapper = new TypeWrapper();
    private description:string;
    private resolveFn:GraphQLFieldResolver<any, any>;
    private defaultValue;

    setDefaultValue(val:any) {
        this.defaultValue = val;
    }

    setParamsType(paramsFieldType:ArgsType) {
        this.args = new TypeValue();
        this.args.setType(paramsFieldType);
    }

    setParamsThunk(paramsFieldTypeThunk:() => ArgsType) {
        this.args = new TypeValue();
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

    //TODO: extract this to type resolver
    toGraphQLInputFieldConfig(typeResolver:ITypeResolver):GraphQLArgumentConfig | GraphQLInputFieldConfig {
        let type = typeResolver.toGraphQLType(this.type.inferType()) as GraphQLInputType;
        type = this.compositeType.wrap(type) as GraphQLInputType;

        return {
            defaultValue: this.defaultValue,
            description: this.description,
            type
        }
    }

    //TODO: extract this to type resolver
    toGraphQLFieldConfig(typeResolver:ITypeResolver, argsResolver:ITypeResolver):GraphQLFieldConfig<any, any> {
        let type = typeResolver.toGraphQLType(this.type.inferType());
        type = this.compositeType.wrap(type) as GraphQLOutputType;

        return {
            type,
            args: this.args && argsResolver.toGraphQLType(this.args.inferType()) as any,
            resolve: this.resolveFn,
            description: this.description
        }
    }
}