import {noop} from "../../lib/utils/core";
import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";
import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/metadata/FieldsMetadata";
import {interfaceType} from "../../lib/decorators/interface";
import {field} from "../../lib/decorators/fields";
import {InterfaceTypeMetadata} from "../../lib/metadata/InterfaceTypeMetadata";

describe("ObjectTypeMetadata", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeClass,
            someClassMetadata:ObjectTypeMetadata,
            someClassFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeClass = class {};
            someClassMetadata = ObjectTypeMetadata.getOrCreateForClass(SomeClass);
            someClassMetadata.setConfig({name: 'SomeClass'});

            someClassFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeClass);
            someClassFieldsMetadata.patchConfig('requiredDummyField', {type: GraphQLString});
        });

        it("returns GraphQLObjectType", () => {
            expect(someClassMetadata.toGraphQLType()).to.be.instanceOf(GraphQLObjectType);
        });

        it("it pass name property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({name: 'SomeName'});
            expect(someClassMetadata.toGraphQLType().name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLObjectType instance", () => {
            someClassMetadata.setConfig({description: 'Some description'});
            expect(someClassMetadata.toGraphQLType().description).to.eq('Some description');
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
            expect(someClassMetadata.toGraphQLType().getInterfaces()).to.eql([SomeInterface]);
        });

        it("pass annotated class in interface array ", () => {
            @interfaceType({
                resolveType: () => null as any
            })
            class SomeInterface {
                @field(GraphQLString) someField:string;
            }

            someClassMetadata.setConfig({name: 'SomeClass', interfaces: [SomeInterface]});
            expect(someClassMetadata.toGraphQLType().getInterfaces()).to.eql([
                InterfaceTypeMetadata.getForClass(SomeInterface).toGraphQLType()
            ]);
        });
    });
});