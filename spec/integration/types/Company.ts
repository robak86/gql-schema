import {nonNull, type} from "../../../lib";
import {field, id, listThunk} from "../../../lib/";
import {User} from "./User";
import {GraphQLString} from "graphql";

@type()
export class Company {
    @id() @nonNull()
    id:string;

    @field(GraphQLString)
    name:string;

    @listThunk(() => User)
    employees:User[];
}
