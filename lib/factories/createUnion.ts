import {GraphQLObjectType, GraphQLUnionType, Thunk} from "graphql";
import {inferGraphQLType} from "../utils";
import {ObjectTypeMetadata} from "../metadata/ObjectTypeMetadata";
import * as _ from 'lodash';

export function createUnion(name:string, types:Thunk<Array<GraphQLObjectType|Function>>, resolveType):GraphQLUnionType{
    return new GraphQLUnionType({
        name,
        types: _.castArray(types).map(type => inferGraphQLType(type as any, [ObjectTypeMetadata])),
        resolveType: () => {
            throw new Error('createUnion resolveType not implemented');
        }
    });
}


