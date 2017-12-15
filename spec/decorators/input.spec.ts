import {expect} from 'chai';
import {input} from "../../lib";
import {GraphQLInputField, GraphQLObjectType, GraphQLString} from "graphql";
import {field} from "../../lib";
import {ParamsMetadata} from "../../lib/types-metadata/ParamsMetadata";


describe("@input", () => {
    describe("@input()", () => {
        @input({description: 'Some description'})
        class SomeInputParams {
            @field(GraphQLString) someDummyField:string;
        }

        it("attaches metadata object", () => {
            expect(ParamsMetadata.getForClass(SomeInputParams)).to.be.instanceof(ParamsMetadata)
        });

        it("sets default name using class name", () => {
            expect(ParamsMetadata.getForClass(SomeInputParams).toGraphQLInputObjectType().name).to.eq('SomeInputParams');
        });

        it("sets description property", () => {
            expect(ParamsMetadata.getForClass(SomeInputParams).toGraphQLInputObjectType().description).to.eq('Some description');
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
                    let graphQLObjectType = ParamsMetadata.getOrCreateForClass(SomeInputParams).toGraphQLInputObjectType();
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
                let graphQLObjectType = ParamsMetadata.getOrCreateForClass(NewUserParams).toGraphQLInputObjectType();
                let someFieldField:GraphQLInputField = graphQLObjectType.getFields()['address'];
                let someFieldGraphQLObjectType:GraphQLObjectType = someFieldField.type as any;

                expect(someFieldGraphQLObjectType).to.eql(ParamsMetadata.getForClass(NewUserAddressParams).toGraphQLInputObjectType());
            });
        });
    });
});