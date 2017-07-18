import {Company} from "./Company";
import {arrayThunk, field} from "../../../lib/decorators/fields";
import {GraphQLString} from "graphql";
import {type} from "../../../lib/decorators/type";

@type()
export class User {
    @field(GraphQLString)
    firstName:string;

    @arrayThunk(() => Company)
    employers: Company
}