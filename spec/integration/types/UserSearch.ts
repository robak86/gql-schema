import {input, field} from "../../../lib";
import {GraphQLString} from "graphql";


@input({description: `User search address params`})
export class UserSearchAddressParams {
    @field(GraphQLString)
    street:string;
}

@input()
export class UserSearchParams {
    @field(GraphQLString)
    firstName:UserSearchAddressParams;

    @field(UserSearchAddressParams)
    address:UserSearchAddressParams
}

@input()
export class UsersArguments {
    @field(UserSearchParams)
    params:UserSearchParams
}
