import {input} from "../../../lib/decorators/input";
import {GraphQLString} from "graphql";
import {field} from "../../../lib/";
import {argsType} from "../../../lib/decorators/argsType";


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

@argsType()
export class UsersArguments {
    @field(UserSearchParams)
    params:UserSearchParams
}
