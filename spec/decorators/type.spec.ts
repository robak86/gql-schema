import {expect} from 'chai';
import {GraphQLString} from "graphql";
import {field, type} from "../../lib";
import {TypeMetadata} from "../../lib/types-metadata/TypeMetadata";
import {getMetadata} from "../../lib/utils/metadata";

describe("@type", () => {
    describe("@type()", () => {
        @type()
        class SomeType {
            @field(GraphQLString)
            someField:string;
        }

        it("attaches metadata object", () => {
            expect(getMetadata(SomeType)).to.be.instanceof(TypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(TypeMetadata.getForClass(SomeType).config.get('name')).to.eq('SomeType');
        });
    });
});