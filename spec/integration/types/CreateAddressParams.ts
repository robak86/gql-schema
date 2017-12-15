import {field, input} from "../../../lib";
import {GraphQLString} from "graphql";

@input()
export class CreateAddressParams {
    @field(GraphQLString)
    streetName:string;

    @field(GraphQLString)
    city:string
}