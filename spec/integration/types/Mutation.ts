import {type} from "../../../lib/decorators/type";

import {GraphQLString} from "graphql";
import {field} from "../../../lib/index";

@type()
export class Mutation {
    @field(GraphQLString)
    someMutation:string
}