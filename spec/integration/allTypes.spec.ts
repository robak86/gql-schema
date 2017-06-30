import {type} from "../../lib/decorators/type";
import {buildASTSchema, GraphQLString, parse, printType} from "graphql";
import {expect} from 'chai';
import {GraphQLSchema} from "graphql/type/schema";
import {createSchema} from "../../lib/factories/createSchema";
import {args} from "../../lib/decorators/args";
import {input} from "../../lib/index";

function createdSchemaFromDecoratedClasses():GraphQLSchema {

    @input.define()
    class UserSearchAddressParams {
        @input.field({type: GraphQLString})
        street:string;
    }

    @input.define()
    class UserSearchParams {
        @input.field({type: GraphQLString})
        firstName:UserSearchAddressParams;

        @input.field({type: UserSearchAddressParams})
        address:UserSearchAddressParams
    }

    @type.define()
    class User {
        @type.field({type: GraphQLString})
        firstName:string;
    }


    class UsersArguments {
        @args.field({type: UserSearchParams})
        params: UserSearchParams
    }

    @type.define()
    class Query {
        @type.field({type: GraphQLString})
        someQuery:string;

        @type.array({type: User, args: UsersArguments})
        users:User[];
    }

    @type.define()
    class Mutation {
        @type.field({type: GraphQLString})
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

describe.only("building schema", () => {

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