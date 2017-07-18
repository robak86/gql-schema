import {input} from "../../../lib/decorators/input";
import {GraphQLString} from "graphql";
import {field} from "../../../lib/decorators/fields";
import {paramsObject} from "../../../lib/decorators/paramsObject";


@input({description: `User search address params`})
class UserSearchAddressParams {
    @field(GraphQLString)
    street:string;
}

@input()
class UserSearchParams {
    @field(GraphQLString)
    firstName:UserSearchAddressParams;

    @field(UserSearchAddressParams)
    address:UserSearchAddressParams
}

@paramsObject()
export class UsersArguments {
    @field(UserSearchParams)
    params:UserSearchParams
}
