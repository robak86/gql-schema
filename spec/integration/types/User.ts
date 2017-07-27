import {Company} from "./Company";
import {listLazy, field, id, nonNull, resolve, nonNullItems} from "../../../lib/";
import {GraphQLString} from "graphql";
import {type} from "../../../lib/decorators/type";
import {resolveEmployersForUser} from "../resolvers/queries";
import {UserRole} from "./UserRole";


@type()
export class User {
    @id() @nonNull()
    id:string;

    @field(GraphQLString)
    firstName:string;

    @field(GraphQLString) @resolve((user:User) => user.firstName.toUpperCase())
    firstNameUpperCase:string;

    @listLazy(() => Company) @nonNull() @nonNullItems()
    @resolve(resolveEmployersForUser)
    employers:Company[];

    @field(UserRole) @nonNull()
    role:UserRole
}