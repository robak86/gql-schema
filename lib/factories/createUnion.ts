import {GraphQLObjectType, GraphQLUnionType, Thunk} from "graphql";
import * as _ from 'lodash';
import {typesResolver} from "../types-conversion/TypesResolver";


//TODO: rename to - unionType
export function createUnion(name:string, types:Thunk<Array<GraphQLObjectType | Function>>, resolveType):GraphQLUnionType {
    return new GraphQLUnionType({
        name,
        types: _.castArray(types).map(type => typesResolver.toGraphQLType(type)) as any,        //TODO: fix types
        resolveType: (value, context) => typesResolver.toGraphQLType(resolveType(value, context)) as any  //TODO: fix types
    });
}