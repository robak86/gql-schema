import {GraphQLSchema} from "graphql";
import {ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import {someOrThrow} from "../utils/core";

export function createSchema(annotatedRootClass, annotatedMutationClass):GraphQLSchema {
    let query = someOrThrow(
        ObjectTypeMetadata.getForClass(annotatedRootClass),
        'Class provided as query root is not decorated with @type.define');


    let mutation = someOrThrow(
        ObjectTypeMetadata.getForClass(annotatedMutationClass),
        'Class provided as query root is not decorated with @type.define')

    return new GraphQLSchema({
        query: query.toGraphQLType(),
        mutation: mutation.toGraphQLType()
    })
}