import {buildASTSchema, GraphQLInt, GraphQLString, parse, printType} from "graphql";
import {expect} from 'chai';
import {GraphQLSchema} from "graphql/type/schema";
import {createSchema, field, id, list, nonNull, nonNullItems, type} from "../../lib";
import {FieldsMetadata} from "../../lib/fields-metadata/FieldsMetadata";
import {ClassType} from "../../lib/utils/types";


@type()
class GenericQueryListResult<T> {
    items:T;

    @field(GraphQLInt) @nonNull()
    totalCount:number;
}

//class factory
function ListQueryResult<T>(itemClass:ClassType<T>) {
    let listResultsClass = class extends GenericQueryListResult<T> {};
    let fields = FieldsMetadata.getOrCreateForClass(listResultsClass);
    let itemsField = fields.getField('items');
    itemsField.setListType(itemClass);
    itemsField.setNonNullConstraint();
    itemsField.setNonNullItemsConstraint();
    return listResultsClass;
}

@type()
class Mutation {
    @field(GraphQLString)
    unused:string;
}


@type()
class ListResult {
    @field(GraphQLInt) @nonNull()
    totalCount:number;
}

@type()
class PersistedObject {
    @id() @nonNull()
    id:string;

    @field(GraphQLInt)
    createdAt:number; //for simplification store as integer timestamp instead of custom scalar

    @field(GraphQLInt)
    updatedAt:number; //for simplification store as integer timestamp instead of custom scalar
}

@type()
class User extends PersistedObject {
    @field(GraphQLString)
    email:string
}

@type()
class UsersList extends ListQueryResult(User) {}

@type()
class Product extends PersistedObject {
    @field(GraphQLString)
    productName:string
}

@type()
class ProductsList extends ListResult {
    @list(Product) @nonNull() @ nonNullItems()
    products:Product[]
}


@type()
class Query {
    @field(UsersList) @nonNull()
    users:UsersList;

    @field(ProductsList) @nonNull()
    products:ProductsList;
}


function createdSchemaFromDecoratedClasses():GraphQLSchema {
    return createSchema(Query, Mutation);
}

function createSchemaFromDefinition():GraphQLSchema {
    const definition = `
            type User {
                id: ID!
                createdAt: Int
                updatedAt: Int
                email: String
            }
            
            type Product {
                id: ID!
                createdAt: Int
                updatedAt: Int
                productName: String
            }
            
            type UsersList {
                totalCount: Int!
                items: [User!]!
            }
            
            type ProductsList {
                totalCount: Int!
                products: [Product!]!
            }
            
            type Query {
                users: UsersList!
                products: ProductsList!
            }

            type Mutation {
                unused:String
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

    describe("type User", () => {
        it("generates proper type", () => {
            expectTypesEqual('User');
        });
    });

    describe("type Product", () => {
        it("generates proper type", () => {
            expectTypesEqual('Product');
        });
    });

    describe("type UsersList", () => {
        it("generates proper type", () => {
            expectTypesEqual('UsersList');
        });
    });

    describe("input ProductsList", () => {
        it("generates proper type", () => {
            expectTypesEqual('ProductsList');
        });
    });
});