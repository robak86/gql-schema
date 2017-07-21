import {Company} from "../types/Company";
import {UserRole} from "../types/UserRole";

export type CompanyEntity = { id:string; name:string; employeesIds:string[], type: 'company' };
export type UserEntity = { id:string; firstName:string; employersIds:string[], role:UserRole, type: 'user' };

export function getCompanyById(id:string):CompanyEntity {
    return getAllCompanies().filter(company => company.id === id)[0];
}

export function getAllCompanies():CompanyEntity[] {
    return [
        {id: '1', name: 'Some Company', employeesIds: ['1'], type: 'company'},
        {id: '2', name: 'Some Other Company', employeesIds: ['2'], type: 'company'},
        {id: '3', name: 'Company', employeesIds: ['3'], type: 'company'},
    ]
}

export function getAllUsers():UserEntity[] {
    return [
        {id: '1', firstName: 'Jane', role:'admin', employersIds: ['1'], type: 'user'},
        {id: '2', firstName: 'John', role:'stuff', employersIds: ['2'], type: 'user'},
        {id: '3', firstName: 'Adam', role:'quest', employersIds: ['3'], type: 'user'},
    ]
}

export function getUserById(id:string):UserEntity {
    return getAllUsers().filter(user => user.id === id)[0];
}

export function getUserByFirstName(firstName:string):UserEntity[] {
    return getAllUsers().filter(user => user.firstName.indexOf(firstName) !== -1);
}


