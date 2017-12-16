import {noop} from "../../lib/utils/core";
import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLString} from "graphql";
import {field, type} from "../../lib";
import {InterfaceTypeMetadata} from "../../lib/types-metadata/InterfaceTypeMetadata";
import {FieldsMetadata} from "../../lib/fields-metadata/FieldsMetadata";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";


describe("InterfaceTypeMetadata", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeInterface,
            someInterfaceMetadata:InterfaceTypeMetadata,
            someInterfaceFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeInterface = class {};
            someInterfaceMetadata = InterfaceTypeMetadata.getOrCreateForClass(SomeInterface);
            someInterfaceFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeInterface);
            someInterfaceFieldsMetadata.getField('requiredDummyField').setType(GraphQLString);
        });

        it("returns GraphQLInterfaceType", () => {
            expect(someInterfaceMetadata.toGraphQLInterfaceType()).to.be.instanceOf(GraphQLInterfaceType);
        });

        it("it pass name property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({name: 'SomeName'});
            expect(someInterfaceMetadata.toGraphQLInterfaceType().name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({description: 'Some description'});
            expect(someInterfaceMetadata.toGraphQLInterfaceType().description).to.eq('Some description');
        });

        it("infers annotated types from resolveType function", () => {
            @type()
            class SomeClass {
                @field(GraphQLString) someField:string;
            }

            someInterfaceMetadata.setConfig({name: 'SomeName', resolveType: () => SomeClass});
            expect(someInterfaceMetadata.toGraphQLInterfaceType().resolveType(null, null, null)).to
                .eql(TypeMetadata.getForClass(SomeClass).toGraphQLObjectType())
        });
    });
});

