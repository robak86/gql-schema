import {createEnum} from "../../../lib/factories/createEnum";
import {GraphQLEnumType} from "graphql";

export type UserRole = 'admin' | 'stuff' | 'guest';
export const UserRoleType:GraphQLEnumType = createEnum('UserRole', ['admin', 'stuff', 'guest']);