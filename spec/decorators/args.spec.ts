import {GraphQLString} from "graphql";
import {expect} from 'chai';
import {ArgumentMapMetadata} from "../../lib/metadata/ArgumentMapMetadata";
import {field} from "../../lib";
import {argsType} from "../../lib/decorators/argsType";


describe("argsType decorator", () => {
    describe("@argsType()", () => {
        @argsType()
        class SomeArgsType {
            @field(GraphQLString) _:string
        }

        it("attaches metadata object", () => {
            expect(ArgumentMapMetadata.getForClass(SomeArgsType)).to.be.instanceof(ArgumentMapMetadata)
        });
    });

    describe("@field", () => {
        it("registers property", () => {
            @argsType()
            class SomeClass {
                @field(GraphQLString)
                arg1:string
            }

            let graphQLFieldConfigArgumentMap = ArgumentMapMetadata.getOrCreateForClass(SomeClass).toGraphQLType();
            expect(graphQLFieldConfigArgumentMap['arg1'].type).to.eq(GraphQLString)
        });
    });
});