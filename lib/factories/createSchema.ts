import {GraphQLObjectType, GraphQLSchema} from "graphql";
import {typesResolver} from "../types-conversion/TypesResolver";

export function createSchema(annotatedRootClass, annotatedMutationClass):GraphQLSchema {


    return new GraphQLSchema({
        query: typesResolver.toGraphQLType(annotatedRootClass) as GraphQLObjectType,
        mutation: typesResolver.toGraphQLType(annotatedMutationClass) as GraphQLObjectType
    })
}