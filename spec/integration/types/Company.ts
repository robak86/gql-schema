import {type} from "../../../lib/decorators/type";
import {arrayThunk} from "../../../lib/decorators/fields";
import {User} from "./User";


@type()
export class Company {
    @arrayThunk(() => User)
    employees:User;
}
