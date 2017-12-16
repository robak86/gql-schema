import {GraphQLSchema} from "graphql";
import {someOrThrow} from "../utils/core";
import {TypeMetadata} from "../types-metadata/TypeMetadata";

export function createSchema(annotatedRootClass, annotatedMutationClass):GraphQLSchema {
    let query = someOrThrow(
        TypeMetadata.getForClass(annotatedRootClass),
        'Class provided as query root is not decorated with @type');


    let mutation = someOrThrow(
        TypeMetadata.getForClass(annotatedMutationClass),
        'Class provided as query root is not decorated with @type');

    return new GraphQLSchema({
        query: query.toGraphQLObjectType(),
        mutation: mutation.toGraphQLObjectType()
    })
}