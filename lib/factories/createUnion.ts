import {GraphQLObjectType, GraphQLUnionType, Thunk} from "graphql";

import {ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import * as _ from 'lodash';
import {inferGraphQLType} from "../decorators/typesInferention";

export function createUnion(name:string, types:Thunk<Array<GraphQLObjectType|Function>>, resolveType):GraphQLUnionType {
    return new GraphQLUnionType({
        name,
        types: _.castArray(types).map(type => inferGraphQLType(type as any, [ObjectTypeMetadata])),
        resolveType: (value, context) => {
            return inferGraphQLType(resolveType(value,context));
        }
    });
}


