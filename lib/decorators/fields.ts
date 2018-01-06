import {GraphQLFieldResolver, GraphQLID} from "graphql";
import {createFieldDecorator} from "./helpers";
import {ArgsType, FieldType} from "../fields-metadata/FieldConfig";

export const id = ():PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setType(GraphQLID)
});

export const field = (type:FieldType):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setType(type);
});

export const fieldThunk = (thunkType:() => (FieldType)):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setTypeThunk(thunkType);
});

export const nonNull = ():PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setNonNullConstraint()
});

export const nonNullItems = ():PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setNonNullItemsConstraint()
});
export const description = (description:string):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setDescription(description)
});

export const params = (argsType:ArgsType):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setParamsType(argsType)
});

export const defaultValue = (val):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setDefaultValue(val)
});

export const paramsThunk = (argsType:() => ArgsType):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setParamsThunk(argsType)
});

export const resolve = <T>(resolve:GraphQLFieldResolver<any, any>):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setResolver(resolve);
});

export const list = (type:FieldType):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setListType(type)
});

export const listThunk = (thunkType:() => FieldType):PropertyDecorator => createFieldDecorator(fieldConfig => {
    fieldConfig.setListTypeThunk(thunkType)
});