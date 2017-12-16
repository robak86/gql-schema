import {field, input, nonNull} from "../../../lib";
import {GraphQLString} from "graphql";

@input()
export class CreateCompanyParams {
    @field(GraphQLString)
    companyName:string;
}


@input()
export class CreateCompanyParamsWrapped {
    @field(CreateCompanyParams) @nonNull()
    input:CreateCompanyParams
}