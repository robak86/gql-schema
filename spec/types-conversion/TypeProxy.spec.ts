import {GraphQLEnumType, GraphQLInt, GraphQLString} from "graphql";
import {TypeProxy} from "../../lib/types-conversion/TypeProxy";
import {expect} from 'chai';
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";
import * as sinon from 'sinon';
import {ParamsMetadata} from "../../lib/types-metadata/ParamsMetadata";
import {InterfaceTypeMetadata} from "../../lib/types-metadata/InterfaceTypeMetadata";
import {enumsRegistry} from "../../lib/registry/typesRegistry";

describe("TypeProxy", () => {
    describe(".toGraphQLType()", () => {
        describe("converting native types", () => {
            describe("GraphQLString", () => {
                it(`returns GraphQLString`, () => {
                    expect(TypeProxy.inferType(GraphQLString)).to.eq(GraphQLString);
                    expect(TypeProxy.inferTypeThunk(() => GraphQLString)).to.eq(GraphQLString);
                });
            });

            describe("GraphQLInt", () => {
                expect(TypeProxy.inferType(GraphQLInt)).to.eq(GraphQLInt);
                expect(TypeProxy.inferTypeThunk(() => GraphQLInt)).to.eq(GraphQLInt);
            });
        });

        describe("converting type decorated with TypeMetadata", () => {
            let SomeClass;

            beforeEach(() => {
                SomeClass = class {};
                let typeMetadata = TypeMetadata.getOrCreateForClass(SomeClass);
                sinon.stub(typeMetadata, 'toGraphQLObjectType').returns(GraphQLString);
            });

            it('returns object returned by toGraphQLObjectType on TypeMetadata', () => {
                expect(TypeProxy.inferType(SomeClass)).to.eq(GraphQLString);
            });
        });

        describe("converting type decorated with ParamsMetadata", () => {
            let SomeClass;

            beforeEach(() => {
                SomeClass = class {};
                let paramsMetadata = ParamsMetadata.getOrCreateForClass(SomeClass);
                sinon.stub(paramsMetadata, 'toGraphQLInputObjectType').returns(GraphQLString);
            });

            it('returns object returned by toGraphQLInputObjectType on TypeMetadata', () => {
                expect(TypeProxy.inferType(SomeClass)).to.eq(GraphQLString);
            });
        });

        describe("converting type decorated with InterfaceMetadata", () => {
            let SomeClass;

            beforeEach(() => {
                SomeClass = class {};
                let interfaceMetadata = InterfaceTypeMetadata.getOrCreateForClass(SomeClass);
                sinon.stub(interfaceMetadata, 'toGraphQLInterfaceType').returns(GraphQLString);
            });

            it('returns object returned by toGraphQLInterfaceType on InterfaceMetadata', () => {
                expect(TypeProxy.inferType(SomeClass)).to.eq(GraphQLString);
            });
        });

        describe("converting enum type", () => {
            enum Enum {
                A = 'a',
                B = 'b'
            }

            beforeEach(() => {
                enumsRegistry.registerEnum('Enum', Enum, 'SomeEnumDescription');
            });

            it('returns object returned by toGraphQLInterfaceType on InterfaceMetadata', () => {
                expect(TypeProxy.inferType(Enum)).to.eql(new GraphQLEnumType({
                    name: 'Enum',
                    description: 'SomeEnumDescription',
                    values: {
                        A: {value: 'a'},
                        B: {value: 'b'}
                    }
                }));
            });
        });
    });
});