import {noop} from "../../../lib/utils/core";
import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../../lib/fields-metadata/FieldsMetadata";
import {TypeMetadata} from "../../../lib/types-metadata/TypeMetadata";
import {ObjectTypeResolver} from "../../../lib/types-conversion/output/ObjectTypeResolver";
import {typesResolver} from "../../../lib/types-conversion/TypesResolver";
import {field, interfaceType} from "../../../lib";

describe("ObjectTypeResolver", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeClass:Object,
            someClassMetadata:TypeMetadata;

        beforeEach(() => {
            SomeClass = class {};
            someClassMetadata = TypeMetadata.getOrCreateForClass(SomeClass);
            someClassMetadata.setConfig({name: 'SomeClass'});

            let someClassFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeClass);
            someClassFieldsMetadata.getField('requiredDummyField').setType(GraphQLString);
        });

        it("returns GraphQLObjectType", () => {
            expect(typesResolver.toGraphQLType(SomeClass)).to.be.instanceOf(GraphQLObjectType);
        });

        it("it pass name property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({name: 'SomeName'});
            let graphQLObjectType = typesResolver.toGraphQLType(SomeClass) as GraphQLObjectType;
            expect(graphQLObjectType.name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({description: 'Some description'});
            let graphQLObjectType = typesResolver.toGraphQLType(SomeClass) as GraphQLObjectType;
            expect(graphQLObjectType.description).to.eq('Some description');
        });

        it("pass interfaces property to GraphQLObjectType instance", () => {
            let SomeInterface = new GraphQLInterfaceType({
                name: 'SomeType',
                resolveType: value => ({}) as any,
                fields: {
                    someField: {
                        type: GraphQLString,
                    }
                }
            });

            someClassMetadata.setConfig({name: 'SomeClass', interfaces: [SomeInterface]});

            let graphQLObjectType = typesResolver.toGraphQLType(SomeClass) as GraphQLObjectType;
            expect(graphQLObjectType.getInterfaces()).to.eql([SomeInterface]);
        });

        it("pass annotated class in interface array ", () => {
            @interfaceType({
                resolveType: () => null as any
            })
            class SomeInterface {
                @field(GraphQLString) someField:string;
            }

            someClassMetadata.setConfig({name: 'SomeClass', interfaces: [SomeInterface]});
            let someClassGQType = typesResolver.toGraphQLType(SomeClass) as GraphQLObjectType;

            expect(someClassGQType.getInterfaces()).to.eql([
                typesResolver.toGraphQLType(SomeInterface)
            ]);
        });
    });
});