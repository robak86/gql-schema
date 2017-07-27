import {type} from "../../../lib/decorators/type";
import {field, id, listLazy} from "../../../lib/";
import {User} from "./User";
import {GraphQLString} from "graphql";
import {nonNull} from "../../../lib/index";

@type()
export class Company {
    @id() @nonNull()
    id:string;

    @field(GraphQLString)
    name:string;

    @listLazy(() => User)
    employees:User[];
}
