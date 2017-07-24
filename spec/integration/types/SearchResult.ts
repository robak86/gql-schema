import {User} from "./User";
import {Company} from "./Company";
import {createUnion} from "../../../lib/factories/createUnion";
import {GraphQLUnionType} from "graphql";



export type SearchResult = User | Company;
export const SearchResultType:GraphQLUnionType = createUnion('SearchResult', [User, Company], (obj) => {
    if (obj.type === 'company') {
        return Company
    }

    if (obj.type === 'user') {
        return User
    }

    throw new Error(`unknown type for ${obj}`);
});