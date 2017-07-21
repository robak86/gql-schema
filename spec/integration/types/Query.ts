import {type} from "../../../lib/decorators/type";
import {GraphQLString} from "graphql";
import {list, field, nonNull, params, resolve, nonNullItems} from "../../../lib/decorators/fields";
import {User} from "./User";
import {UsersArguments} from "./UserSearch";
import {resolveFakeSearch, resolveUsers} from "../resolvers/queries";
import {SearchResult, SearchResultType} from "./SearchResult";


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
}