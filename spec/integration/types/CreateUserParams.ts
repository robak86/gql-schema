import {defaultValue, field, input, list, nonNull} from "../../../lib";
import {GraphQLString} from "graphql";
import {CreateAddressParams} from "./CreateAddressParams";
import {UserRole} from "./UserRole";

@input()
export class CreateUserParams {
    @field(GraphQLString) @nonNull()
    firstName:string;

    @field(GraphQLString) @nonNull()
    lastName:string;

    @field(CreateAddressParams)
    address:CreateAddressParams;

    @list(UserRole) @defaultValue([])
    roles: UserRole[];
}