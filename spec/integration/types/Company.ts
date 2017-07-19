import {type} from "../../../lib/decorators/type";
import {arrayLazy, field, id} from "../../../lib/decorators/fields";
import {User} from "./User";
import {GraphQLString} from "graphql";

@type()
export class Company {
    @id() id:string;

    @field(GraphQLString)
    name:string;

    @arrayLazy(() => User)
    employees:User[];
}
