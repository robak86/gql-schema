import {Company} from "./Company";
import {field, id, listThunk, nonNull, nonNullItems, resolve} from "../../../lib/";
import {GraphQLString} from "graphql";
import {type} from "../../../lib";
import {resolveEmployersForUser} from "../resolvers/queries";
import {UserRole} from "./UserRole";
import {Address} from "./Address";


@type()
export class User {
    @id() @nonNull()
    id:string;

    @field(GraphQLString)
    firstName:string;

    @field(GraphQLString) @resolve((user:User) => user.firstName.toUpperCase())
    firstNameUpperCase:string;

    @field(Address)
    address:Address;

    @listThunk(() => Company) @nonNull() @nonNullItems()
    @resolve(resolveEmployersForUser)
    employers:Company[];

    @field(UserRole) @nonNull()
    role:UserRole
}