import {noop} from "../../../lib/utils/core";
import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLObjectType, GraphQLString} from "graphql";
import {field, type} from "../../../lib";
import {InterfaceTypeMetadata} from "../../../lib/types-metadata/InterfaceTypeMetadata";
import {FieldsMetadata} from "../../../lib/fields-metadata/FieldsMetadata";
import {typesResolver} from "../../../lib/types-conversion/TypesResolver";


describe("InterfaceTypeMetadata", () => {
    describe("static getForClass", noop);
    describe("static getOrCreateForClass", noop);

    describe(".toGraphQLType", () => {
        let SomeInterface:Object,
            someInterfaceMetadata:InterfaceTypeMetadata,
            someInterfaceFieldsMetadata:FieldsMetadata;

        beforeEach(() => {
            SomeInterface = class {};
            someInterfaceMetadata = InterfaceTypeMetadata.getOrCreateForClass(SomeInterface);
            someInterfaceFieldsMetadata = FieldsMetadata.getOrCreateForClass(SomeInterface);
            someInterfaceFieldsMetadata.getField('requiredDummyField').setType(GraphQLString);
        });

        it("returns GraphQLInterfaceType", () => {
            expect(typesResolver.toGraphQLType(SomeInterface)).to.be.instanceOf(GraphQLInterfaceType);
        });

        it("it pass name property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({name: 'SomeName'});
            let graphQLInterfaceType = typesResolver.toGraphQLType(SomeInterface) as GraphQLInterfaceType;
            expect(graphQLInterfaceType.name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({description: 'Some description'});
            let graphQLInterfaceType = typesResolver.toGraphQLType(SomeInterface) as GraphQLInterfaceType;
            expect(graphQLInterfaceType.description).to.eq('Some description');
        });


        it("infers annotated types from resolveType function", () => {
            @type()
            class SomeClass {
                @field(GraphQLString) someField:string;
            }

            someInterfaceMetadata.setConfig({name: 'SomeName', resolveType: () => SomeClass});
            let graphQLType = typesResolver.toGraphQLType(SomeInterface) as GraphQLInterfaceType;
            expect(graphQLType.resolveType(null, null, null)).to
                .eql(typesResolver.toGraphQLType(SomeClass) as GraphQLObjectType)
        });
    });
});

