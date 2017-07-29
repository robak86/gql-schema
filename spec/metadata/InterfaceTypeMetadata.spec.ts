import {noop} from "../../lib/utils/core";
import {InterfaceTypeMetadata} from "../../lib/metadata/InterfaceTypeMetadata";
import {expect} from 'chai';
import {GraphQLInterfaceType, GraphQLString} from "graphql";
import {FieldsMetadata} from "../../lib/metadata/FieldsMetadata";
import {type} from "../../lib/decorators/type";
import {field} from "../../lib/decorators/fields";
import {ObjectTypeMetadata} from "../../lib/metadata/ObjectTypeMetadata";

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
            someInterfaceFieldsMetadata.patchConfig('requiredDummyField', {type: GraphQLString});
        });

        it("returns GraphQLInterfaceType", () => {
            expect(someInterfaceMetadata.toGraphQLType()).to.be.instanceOf(GraphQLInterfaceType);
        });

        it("it pass name property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({name: 'SomeName'});
            expect(someInterfaceMetadata.toGraphQLType().name).to.eq('SomeName');
        });

        it("it pass description property to GraphQLInterfaceType instance", () => {
            someInterfaceMetadata.setConfig({description: 'Some description'});
            expect(someInterfaceMetadata.toGraphQLType().description).to.eq('Some description');
        });

        it("infers annotated types from resolveType function", () => {
            @type()
            class SomeClass {
                @field(GraphQLString) someField:string;
            }

            someInterfaceMetadata.setConfig({name: 'SomeName', resolveType: () => SomeClass});
            expect(someInterfaceMetadata.toGraphQLType().resolveType(null, null, null)).to
                .eql(ObjectTypeMetadata.getForClass(SomeClass).toGraphQLType())
        });
    });
});