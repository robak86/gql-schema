import {type} from "../../../lib";
import {GraphQLString} from "graphql";
import {field, list, nonNull, nonNullItems, params, resolve} from "../../../lib/";
import {User} from "./User";
import {UsersArguments} from "./UserSearch";
import {resolveFakeSearch, resolveUsers} from "../resolvers/queries";
import {SearchResult, SearchResultType} from "./SearchResult";
import {Asset} from "./Asset";
import {Image} from "./Image";
import {AudioAsset} from "./AudioAsset";
import {noop} from "../../../lib/utils/core";


@type()
export class Query {
    @field(GraphQLString)
    someQuery:string;

    @list(User) @nonNull() @nonNullItems()
    @params(UsersArguments) @resolve(resolveUsers)
    users:User[];

    @list(SearchResultType) @nonNull() @nonNullItems()
    @resolve(resolveFakeSearch)
    search:SearchResult;


    @list(Asset) @nonNull() @nonNullItems()
    @resolve(noop)
    searchAssets:Asset;

    @list(Image) @nonNull() @nonNullItems()
    @resolve(noop)
    images:Image;

    @list(AudioAsset) @nonNull() @nonNullItems()
    @resolve(noop)
    audioAssets:AudioAsset;
}