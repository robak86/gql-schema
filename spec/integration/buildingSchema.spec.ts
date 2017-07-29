import {buildASTSchema, parse, printType} from "graphql";
import {expect} from 'chai';
import {GraphQLSchema} from "graphql/type/schema";
import {createSchema} from "../../lib/factories/createSchema";
import {Mutation} from "./types/Mutation";
import {Query} from "./types/Query";


function createdSchemaFromDecoratedClasses():GraphQLSchema {
    return createSchema(Query, Mutation);
}

function createSchemaFromDefinition():GraphQLSchema {
    const definition = `
            # User search address params
            input UserSearchAddressParams {
                street: String
            }

            input UserSearchParams  {
                firstName: String
                address: UserSearchAddressParams
            }

            type User {
                id: ID!
                firstName:String 
                firstNameUpperCase: String
                employers: [Company!]!
                role: UserRole!
            }

            type Query {
                someQuery: String
                users(params: UserSearchParams): [User!]!
                search: [SearchResult!]!
                searchAssets: [Asset!]!
                images: [Image!]!
                audioAssets: [AudioAsset!]!
            }
            
            type Mutation {
                someMutation: String
            }
            
            type Company {
                employees:[User!]!
            }
            
            enum UserRole {
                admin 
                stuff 
                guest
            }
            
            interface Asset {
                 id: ID!
                 size: Int!
                 mimeType: String!
            }
            
            type Image implements Asset {
                 id: ID!
                 size: Int!
                 mimeType: String!
                 width: Int
                 height: Int
            }
            
            type AudioAsset implements Asset {
                id: ID!
                size: Int!
                mimeType: String!
                length: Int
            }
            
            union SearchResult = User | Company
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

    describe("type User", () => {
        it("generates proper type", () => {
            expectTypesEqual('User');
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

    describe("input UserSearchAddressParams", () => {
        it("generates proper type", () => {
            expectTypesEqual('UserSearchAddressParams');
        });
    });

    describe("enum UserSearchAddressParams", () => {
        it("generates proper type", () => {
            expectTypesEqual('UserSearchAddressParams');
        });
    });

    describe("interface Asset", () => {
        it("generates proper type", () => {
            expectTypesEqual('Asset');
        });
    });

    describe("interface Asset", () => {
        it("generates proper type", () => {
            expectTypesEqual('Image');
        });
    });

    describe("interface Asset", () => {
        it("generates proper type", () => {
            expectTypesEqual('AudioAsset');
        });
    });
});