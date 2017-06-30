import {GraphQLEnumType} from "graphql";

export function createEnum(name:string, values:any[]):GraphQLEnumType {
    let _values = {};
    values.forEach(val => _values[val] = {value: val});

    return new GraphQLEnumType({
        name,
        values: _values
    });
}