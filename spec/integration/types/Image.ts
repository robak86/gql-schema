import {type} from "../../../lib/decorators/type";
import {Asset} from "./Asset";
import {GraphQLInt, GraphQLString} from "graphql";
import {field, id, nonNull} from "../../../lib/decorators/fields";

@type({
    interfaces: () => [Asset]
})
export class Image {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt) @nonNull()
    size:number;

    @field(GraphQLString) @nonNull()
    mimeType:string;

    @field(GraphQLInt)
    width:number;

    @field(GraphQLInt)
    height:number;
}