import {type} from "../../lib/decorators/type";
import {buildASTSchema, GraphQLString, parse, printType} from "graphql";
import {expect} from 'chai';
import {GraphQLSchema} from "graphql/type/schema";
import {createSchema} from "../../lib/factories/createSchema";

import {input} from "../../lib/index";
import {params, array, field, notNull} from "../../lib/decorators/fields";
import {paramsObject} from "../../lib/decorators/paramsObject";

function createdSchemaFromDecoratedClasses():GraphQLSchema {

    @input()
    class UserSearchAddressParams {
        @field(GraphQLString)
        street:string;
    }

    @input()
    class UserSearchParams {
        @field(GraphQLString)
        firstName:UserSearchAddressParams;

        @field(UserSearchAddressParams)
        address:UserSearchAddressParams
    }

    @type()
    class User {
        @field(GraphQLString)
        firstName:string;
    }

    @paramsObject()
    class UsersArguments {
        @field(UserSearchParams)
        params:UserSearchParams
    }

    @type()
    class Query {
        @field(GraphQLString)
        someQuery:string;

        @array(User) @notNull()
        @params(UsersArguments)
        users:User[];
    }

    @type()
    class Mutation {
        @field(GraphQLString)
        someMutation:string
    }

    return createSchema(Query, Mutation);
}


function createSchemaFromDefinition():GraphQLSchema {
    const definition = `
            input UserSearchAddressParams {
                street: String
            }

            input UserSearchParams  {
                firstName: String
                address: UserSearchAddressParams
            }

            type User {
                firstName:String!
            }

            type Query {
                someQuery: String
                users(params: UserSearchParams): [User!]!
            }
            
            type Mutation {
                someMutation: String
            }
    `;
    return buildASTSchema(parse(definition));
}


function expectTypesEqual(typeName:string) {
    expect(printType(createdSchemaFromDecoratedClasses().getType(typeName)))
        .to.eql(printType(createSchemaFromDefinition().getType(typeName)));
}

describe("building schema", () => {

    describe("type Query", () => {
        it("generates proper type", () => {
            expectTypesEqual('Query');
        });
    });

    describe("type Mutation", () => {
        it("generates proper type", () => {
            expectTypesEqual('Mutation');
        });
    });

    describe("input UserSearchParams", () => {
        it("generates proper type", () => {
            expectTypesEqual('UserSearchParams');
        });
    });
});