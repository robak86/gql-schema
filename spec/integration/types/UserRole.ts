import {createEnum} from "../../../lib/factories/createEnum";

export type UserRole = 'admin' | 'stuff' | 'guest';
export const UserRoleType = createEnum('UserRole', ['admin', 'stuff', 'guest']);