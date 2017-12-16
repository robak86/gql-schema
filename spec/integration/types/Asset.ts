import {field, id, interfaceType} from "../../../lib/";
import {GraphQLInt, GraphQLString} from "graphql";
import {nonNull} from "../../../lib/decorators/fields";
import {AudioAsset} from "./AudioAsset";


@interfaceType({resolveType})
export class Asset {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt) @nonNull()
    size:number;

    @field(GraphQLString) @nonNull()
    mimeType:string;
}

function resolveType(asset) {
    if (asset.mime === 'image/jpg') {
        return Image
    }

    if (asset.mime === 'audio/mp3') {
        return AudioAsset
    }

    throw new Error("Unknown asset type")
}