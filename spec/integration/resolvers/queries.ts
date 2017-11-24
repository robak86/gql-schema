import {CompanyEntity, getAllCompanies, getAllUsers, getCompanyById, getUserByFirstName, UserEntity} from "./data";
import * as _ from 'lodash';


export function resolveUsers(obj, args, context):UserEntity[] {
    let firstNameFilter = _.get<string>(args, ['params', 'firstName'], undefined);
    if (firstNameFilter) {
        return getUserByFirstName(firstNameFilter);
    } else {
        return getAllUsers();
    }
}

export function resolveEmployersForUser(user:UserEntity, args, context):CompanyEntity[] {
    return user.employersIds.map(id => getCompanyById(id));
}


export function resolveFakeSearch(_, args, context):(UserEntity | CompanyEntity)[] {
    return [
        ...getAllUsers(),
        ...getAllCompanies()
    ]
}