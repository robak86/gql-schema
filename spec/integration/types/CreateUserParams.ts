import {field, input, nonNull} from "../../../lib";
import {GraphQLString} from "graphql";
import {CreateAddressParams} from "./CreateAddressParams";

@input()
export class CreateUserParams {
    @field(GraphQLString) @nonNull()
    firstName:string;

    @field(GraphQLString) @nonNull()
    lastName:string;

    @field(CreateAddressParams)
    address:CreateAddressParams
}