import {field, params, paramsThunk, type} from "../../../lib";
import {User} from "./User";
import {CreateUserParams} from "./CreateUserParams";
import {CreateAddressParams} from "./CreateAddressParams";
import {Address} from "./Address";
import {Company} from "./Company";
import {CreateCompanyParams, CreateCompanyParamsWrapped} from "./CreateCompanyParams";

@type()
export class Mutation {
    @field(User)
    @params(CreateUserParams)
    createUser:User;

    @params(CreateAddressParams)
    @field(Address)
    createAddress:Address;

    @field(Company)
    @paramsThunk(() => CreateCompanyParams)
    createCompany:Company;

    @field(Company)
    @paramsThunk(() => CreateCompanyParamsWrapped)
    createCompanyWrapped:Company;
}