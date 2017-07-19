import {type} from "../../../lib/decorators/type";
import {GraphQLString} from "graphql";
import {array, field, notNull, params, resolve} from "../../../lib/decorators/fields";
import {User} from "./User";
import {UsersArguments} from "./UserSearch";
import {resolveUsers} from "../resolvers/queries";


@type()
export class Query {
    @field(GraphQLString)
    someQuery:string;

    @array(User) @notNull() @params(UsersArguments) @resolve(resolveUsers)
    users:User[];
}