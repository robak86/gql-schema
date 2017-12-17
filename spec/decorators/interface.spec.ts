import {expect} from 'chai';
import {GraphQLString} from "graphql";
import {field, interfaceType} from "../../lib";
import {InterfaceTypeMetadata} from "../../lib/types-metadata/InterfaceTypeMetadata";
import {getMetadata} from "../../lib/utils/metadata";

describe("@interfaceType", () => {
    describe("@interfaceType()", () => {
        @interfaceType()
        class SomeType {
            @field(GraphQLString)
            someField:string;
        }

        it("attaches metadata object", () => {
            expect(getMetadata(SomeType)).to.be.instanceof(InterfaceTypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(InterfaceTypeMetadata.getForClass(SomeType).config.get('name')).to.eq('SomeType');
        });
    });
});