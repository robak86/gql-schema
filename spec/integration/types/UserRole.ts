import {createEnum} from "../../../lib/factories/createEnum";

export type UserRole = 'admin' | 'stuff' | 'quest';
export const UserRoleType = createEnum('UserRole', ['admin', 'stuff', 'quest']);