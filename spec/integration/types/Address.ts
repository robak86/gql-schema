import {field, id, type} from "../../../lib";
import {GraphQLString} from "graphql";

@type()
export class Address {
    @id()
    id:string;

    @field(GraphQLString)
    streetName:string;

    @field(GraphQLString)
    city:string;
}