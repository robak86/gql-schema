import {decorateEnum} from "../../../lib";

export enum UserRole {
    admin = 'admin',
    stuff = 'stuff',
    guest = 'guest'
}

decorateEnum('UserRole', UserRole);