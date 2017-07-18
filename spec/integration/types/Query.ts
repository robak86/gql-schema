import {type} from "../../../lib/decorators/type";
import {GraphQLString} from "graphql";
import {array, field, notNull, params} from "../../../lib/decorators/fields";
import {User} from "./User";
import {UsersArguments} from "./UserSearch";


@type()
export class Query {
    @field(GraphQLString)
    someQuery:string;

    @array(User) @notNull()
    @params(UsersArguments)
    users:User[];
}