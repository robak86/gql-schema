import {type} from "../../../lib/decorators/type";
import {field} from "../../../lib/decorators/fields";
import {GraphQLString} from "graphql";

@type()
export class Mutation {
    @field(GraphQLString)
    someMutation:string
}