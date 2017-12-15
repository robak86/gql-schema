import {noop} from "../../lib/utils/core";

import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/fields-metadata/FieldsMetadata";
import {field, interfaceType} from "../../lib";
import {InterfaceTypeMetadata} from "../../lib/types-metadata/InterfaceTypeMetadata";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";

describe("TypeMetadata", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeClass,
            someClassMetadata:TypeMetadata,
            someClassFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeClass = class {};
            someClassMetadata = TypeMetadata.getOrCreateForClass(SomeClass);
            someClassMetadata.setConfig({name: 'SomeClass'});

            someClassFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeClass);
            someClassFieldsMetadata.getField('requiredDummyField').setType(GraphQLString);
        });

        it("returns GraphQLObjectType", () => {
            expect(someClassMetadata.toGraphQLObjectType()).to.be.instanceOf(GraphQLObjectType);
        });

        it("it pass name property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({name: 'SomeName'});
            expect(someClassMetadata.toGraphQLObjectType().name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({description: 'Some description'});
            expect(someClassMetadata.toGraphQLObjectType().description).to.eq('Some description');
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
            expect(someClassMetadata.toGraphQLObjectType().getInterfaces()).to.eql([SomeInterface]);
        });

        it("pass annotated class in interface array ", () => {
            @interfaceType({
                resolveType: () => null as any
            })
            class SomeInterface {
                @field(GraphQLString) someField:string;
            }

            someClassMetadata.setConfig({name: 'SomeClass', interfaces: [SomeInterface]});
            expect(someClassMetadata.toGraphQLObjectType().getInterfaces()).to.eql([
                InterfaceTypeMetadata.getForClass(SomeInterface).toGraphQLInterfaceType()
            ]);
        });
    });
});