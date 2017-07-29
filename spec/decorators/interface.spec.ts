import {expect} from 'chai';
import {GraphQLString} from "graphql";
import {field} from "../../lib";
import {interfaceType} from "../../lib/decorators/interface";
import {InterfaceTypeMetadata} from "../../lib/metadata/InterfaceTypeMetadata";

describe("@interfaceType", () => {
    describe("@interfaceType()", () => {
        @interfaceType()
        class SomeType {
            @field(GraphQLString)
            someField:string;
        }

        it("attaches metadata object", () => {
            expect(InterfaceTypeMetadata.getForClass(SomeType)).to.be.instanceof(InterfaceTypeMetadata)
        });

        it("sets default name using class name", () => {
            expect(InterfaceTypeMetadata.getForClass(SomeType).toGraphQLType().name).to.eq('SomeType');
        });
    });
});