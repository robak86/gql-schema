import {Company} from "./Company";
import {arrayLazy, field, id, notNull, resolve} from "../../../lib/decorators/fields";
import {GraphQLString} from "graphql";
import {type} from "../../../lib/decorators/type";
import {resolveEmployersForUser} from "../resolvers/queries";
import {UserRole, UserRoleType} from "./UserRole";


@type()
export class User {
    @id()
    id:string;

    @field(GraphQLString)
    firstName:string;

    @field(GraphQLString) @resolve((user:User) => user.firstName.toUpperCase())
    firstNameUpperCase:string;

    @arrayLazy(() => Company) @notNull() @resolve(resolveEmployersForUser)
    employers:Company[];

    @field(UserRoleType) @notNull()
    role:UserRole
}