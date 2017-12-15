import {GraphQLObjectType, GraphQLUnionType, Thunk} from "graphql";
import * as _ from 'lodash';
import {TypeProxy} from "../types-conversion/TypeProxy";


//TODO: rename to - unionType
export function createUnion(name:string, types:Thunk<Array<GraphQLObjectType | Function>>, resolveType):GraphQLUnionType {
    return new GraphQLUnionType({
        name,
        types: _.castArray(types).map(type => TypeProxy.inferType(type)) as any,        //TODO: fix types
        resolveType: (value, context) => TypeProxy.inferType(resolveType(value, context)) as any  //TODO: fix types
    });
}