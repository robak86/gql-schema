import {input} from "../../lib/decorators/input";
import {InputObjectTypeMetadata} from "../../lib/metadata/InputObjectTypeMetadata";
import {expect} from 'chai';
import {GraphQLInputField, GraphQLObjectType, GraphQLString} from "graphql";
import {field} from "../../lib/decorators/fields";

describe("@input", () => {
    describe("@input()", () => {
        @input()
        class SomeInputParams {
            @field(GraphQLString) someDummyField:string;
        }

        it("attaches metadata object", () => {
            expect(InputObjectTypeMetadata.getForClass(SomeInputParams)).to.be.instanceof(InputObjectTypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(InputObjectTypeMetadata.getForClass(SomeInputParams).toGraphQLType().name).to.eq('SomeInputParams');
        });
    });

    describe("@field()", () => {
        describe("native types", () => {
            @input()
            class SomeInputParams {
                @field(GraphQLString)
                someField:string;
            }

            describe("type", () => {
                it("properly passes native type", () => {
                    let graphQLObjectType = InputObjectTypeMetadata.getOrCreateForClass(SomeInputParams).toGraphQLType();
                    let someFieldField:GraphQLInputField = graphQLObjectType.getFields()['someField'];

                    expect(someFieldField.name).to.eq('someField');
                    expect(someFieldField.type).to.eq(GraphQLString);
                });
            });
        });

        describe("decorated class type", () => {
            @input()
            class NewUserAddressParams {
                @field(GraphQLString)
                street:string;
            }

            @input()
            class NewUserParams {
                @field(NewUserAddressParams)
                address:NewUserAddressParams;
            }

            it("it accepts annotated class as type parameter", () => {
                let graphQLObjectType = InputObjectTypeMetadata.getOrCreateForClass(NewUserParams).toGraphQLType();
                let someFieldField:GraphQLInputField = graphQLObjectType.getFields()['address'];
                let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;

                expect(someFieldGraphQLObjectType).to.eql(InputObjectTypeMetadata.getForClass(NewUserAddressParams).toGraphQLType());
            });
        });
    });
});