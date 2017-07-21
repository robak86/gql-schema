import {User} from "./User";
import {Company} from "./Company";
import {createUnion} from "../../../lib/factories/createUnion";



export type SearchResult = User | Company;
export const SearchResultType = createUnion('SearchResult', [User, Company], (obj) => {
    if (obj.type === 'company') {
        return Company
    }

    if (obj.type === 'user') {
        return User
    }

    throw new Error(`unknown type for ${obj}`);
});